export function getErrorMessage(error) {
    if (error instanceof Error) return error.message
    return String(error)
}

export function delay(ms: number){
    return new Promise( resolve => setTimeout(resolve, ms) ); 
}