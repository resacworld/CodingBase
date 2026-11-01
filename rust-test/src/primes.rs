use std::time::Instant;

use rayon::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
pub struct PrimesReport {
    limit: u32,
    count: usize,
    threads: usize,
    sequential_ms: f64,
    parallel_ms: f64,
}

// Deliberately naive: the point is to give the CPU real work to split up.
fn is_prime(n: u32) -> bool {
    n >= 2
        && (2..)
            .take_while(|d| d * d <= n)
            .all(|d| !n.is_multiple_of(d))
}

pub fn compare(limit: u32) -> PrimesReport {
    let start = Instant::now();
    let count = (0..=limit).filter(|&n| is_prime(n)).count();
    let sequential_ms = start.elapsed().as_secs_f64() * 1000.0;

    // Same pipeline, with into_par_iter: rayon spreads it across every core.
    let start = Instant::now();
    let parallel_count = (0..=limit).into_par_iter().filter(|&n| is_prime(n)).count();
    let parallel_ms = start.elapsed().as_secs_f64() * 1000.0;
    assert_eq!(count, parallel_count);

    PrimesReport {
        limit,
        count,
        threads: rayon::current_num_threads(),
        sequential_ms,
        parallel_ms,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_primes_the_same_way_in_both_modes() {
        assert_eq!(compare(1).count, 0);
        assert_eq!(compare(2).count, 1);
        assert_eq!(compare(100).count, 25);
        assert_eq!(compare(100_000).count, 9_592);
    }
}
