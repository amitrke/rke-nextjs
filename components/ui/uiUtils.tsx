export const uiDateFormat = (datetime: number) => {
    return new Date(datetime).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})
}