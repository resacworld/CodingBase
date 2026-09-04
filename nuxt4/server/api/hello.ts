export default defineEventHandler(() => {
    const delay = 4000; // Simulate a delay of 2 seconds
    // We wait 2 seconds to simlate a slow API response
    const start = Date.now();
    while (Date.now() - start < delay) {
        // Busy wait
    }


    return { message: "Salut depuis Nitros 2", time: new Date().toISOString() }
})