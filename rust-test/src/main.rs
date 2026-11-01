mod primes;

use std::convert::Infallible;
use std::env;
use std::sync::{Arc, RwLock};

use axum::Router;
use axum::extract::{Query, State};
use axum::http::{StatusCode, header};
use axum::response::sse::{Event, KeepAlive, Sse};
use axum::response::{IntoResponse, Json};
use axum::routing::get;
use maud::{DOCTYPE, Markup, html};
use primes::PrimesReport;
use serde::{Deserialize, Serialize};
use tokio::sync::broadcast;
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::{Stream, StreamExt};

const DEFAULT_PRIMES_LIMIT: u32 = 2_000_000;
const MAX_PRIMES_LIMIT: u32 = 5_000_000;

#[derive(Clone, Debug, Serialize)]
struct Todo {
    id: usize,
    title: String,
}

#[derive(Deserialize)]
struct NewTodo {
    title: String,
}

#[derive(Deserialize)]
struct PrimesQuery {
    limit: Option<u32>,
}

// Cloned for each request; the Arc and the Sender both point to the same shared data.
#[derive(Clone)]
struct AppState {
    // In-memory store, lost on restart, like the other test projects.
    todos: Arc<RwLock<Vec<Todo>>>,
    new_todos: broadcast::Sender<Todo>,
}

impl AppState {
    fn new() -> Self {
        let first = Todo {
            id: 1,
            title: "Tester le SSR".into(),
        };
        let (new_todos, _) = broadcast::channel(64);
        Self {
            todos: Arc::new(RwLock::new(vec![first])),
            new_todos,
        }
    }
}

fn app(state: AppState) -> Router {
    Router::new()
        .route("/", get(page))
        .route("/style.css", get(style))
        .route("/app.js", get(script))
        .route("/api/todos", get(list_todos).post(add_todo))
        .route("/api/events", get(events))
        .route("/api/primes", get(compare_primes))
        .with_state(state)
}

#[tokio::main]
async fn main() {
    let port = env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3002u16);
    let listener = tokio::net::TcpListener::bind(("127.0.0.1", port))
        .await
        .unwrap();
    println!("http://localhost:{port}");
    axum::serve(listener, app(AppState::new())).await.unwrap();
}

// The html! macro is checked at compile time and escapes every interpolated value (XSS).
async fn page(State(state): State<AppState>) -> Markup {
    let todos = state.todos.read().unwrap().clone();
    html! {
        (DOCTYPE)
        html lang="fr" {
            head {
                meta charset="utf-8";
                meta name="viewport" content="width=device-width, initial-scale=1";
                title { "Rust test" }
                link rel="stylesheet" href="/style.css";
                script src="/app.js" defer {}
            }
            body {
                main {
                    h1 { "Todos (SSR)" }
                    p .hint { "Ouvre un deuxième onglet : les ajouts s'y affichent en direct." }
                    ul #todos {
                        @for todo in &todos {
                            li data-id=(todo.id) { (todo.title) }
                        }
                    }
                    form #todo-form {
                        input #title aria-label="Nouvelle tâche" required;
                        button { "Ajouter" }
                    }

                    h2 { "Calcul sur tous les cœurs" }
                    p .hint { "Compte les nombres premiers, sur un seul cœur puis sur tous." }
                    form #primes-form {
                        input #limit aria-label="Limite" type="number" min="1"
                            max=(MAX_PRIMES_LIMIT) value=(DEFAULT_PRIMES_LIMIT);
                        button { "Lancer" }
                    }
                    p #primes-result aria-live="polite" {}
                }
            }
        }
    }
}

async fn style() -> impl IntoResponse {
    (
        [(header::CONTENT_TYPE, "text/css")],
        include_str!("../static/style.css"),
    )
}

async fn script() -> impl IntoResponse {
    (
        [(header::CONTENT_TYPE, "text/javascript")],
        include_str!("../static/app.js"),
    )
}

async fn list_todos(State(state): State<AppState>) -> Json<Vec<Todo>> {
    Json(state.todos.read().unwrap().clone())
}

async fn add_todo(
    State(state): State<AppState>,
    Json(input): Json<NewTodo>,
) -> Result<Json<Todo>, StatusCode> {
    let title = input.title.trim();
    if title.is_empty() {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }

    let todo = {
        let mut todos = state.todos.write().unwrap();
        let todo = Todo {
            id: todos.len() + 1,
            title: title.to_owned(),
        };
        todos.push(todo.clone());
        todo
    };
    // Sending only fails when no browser is listening, which is fine.
    let _ = state.new_todos.send(todo.clone());
    Ok(Json(todo))
}

// Server-Sent Events: pushes each new todo to every open tab.
async fn events(
    State(state): State<AppState>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let stream = BroadcastStream::new(state.new_todos.subscribe())
        // A tab that lags behind skips events; it catches up when it reconnects.
        .filter_map(Result::ok)
        .map(|todo| {
            Ok(Event::default()
                .json_data(&todo)
                .expect("Todo serializes to JSON"))
        });
    Sse::new(stream).keep_alive(KeepAlive::default())
}

async fn compare_primes(
    Query(query): Query<PrimesQuery>,
) -> Result<Json<PrimesReport>, StatusCode> {
    let limit = query
        .limit
        .unwrap_or(DEFAULT_PRIMES_LIMIT)
        .clamp(1, MAX_PRIMES_LIMIT);
    // CPU-heavy work must stay off the async threads that serve the other requests.
    tokio::task::spawn_blocking(move || primes::compare(limit))
        .await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use http_body_util::BodyExt;
    use tower::ServiceExt;

    fn post_todo(title: &str) -> Request<Body> {
        Request::post("/api/todos")
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(
                serde_json::json!({ "title": title }).to_string(),
            ))
            .unwrap()
    }

    async fn body_text(response: axum::response::Response) -> String {
        let bytes = response.into_body().collect().await.unwrap().to_bytes();
        String::from_utf8(bytes.to_vec()).unwrap()
    }

    #[tokio::test]
    async fn adds_a_trimmed_todo_and_notifies_listeners() {
        let state = AppState::new();
        let mut listener = state.new_todos.subscribe();

        let response = app(state.clone())
            .oneshot(post_todo("  Apprendre Rust "))
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            body_text(response).await,
            r#"{"id":2,"title":"Apprendre Rust"}"#
        );
        assert_eq!(listener.try_recv().unwrap().title, "Apprendre Rust");
        assert_eq!(state.todos.read().unwrap().len(), 2);
    }

    #[tokio::test]
    async fn rejects_a_blank_title() {
        let state = AppState::new();

        let response = app(state.clone()).oneshot(post_todo("   ")).await.unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
        assert_eq!(state.todos.read().unwrap().len(), 1);
    }

    #[tokio::test]
    async fn page_renders_todos_and_escapes_html() {
        let state = AppState::new();
        app(state.clone())
            .oneshot(post_todo("<script>x</script>"))
            .await
            .unwrap();

        let request = Request::get("/").body(Body::empty()).unwrap();
        let html = body_text(app(state).oneshot(request).await.unwrap()).await;

        assert!(html.contains("Tester le SSR"));
        assert!(html.contains("&lt;script&gt;x&lt;/script&gt;"));
        assert!(!html.contains("<script>x"));
    }

    #[tokio::test]
    async fn clamps_the_primes_limit() {
        let request = Request::get("/api/primes?limit=4000000000")
            .body(Body::empty())
            .unwrap();
        let report = body_text(app(AppState::new()).oneshot(request).await.unwrap()).await;

        assert!(report.contains(&format!(r#""limit":{MAX_PRIMES_LIMIT}"#)));
    }
}
