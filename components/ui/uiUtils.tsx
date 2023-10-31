import Head from "next/head";

export const uiDateFormat = (datetime: number) => {
    return new Date(datetime).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})
}

export const uiRound = (value: number, precision?: number) => {
    return Math.round(value * (precision || 1)) / (precision || 1);
}
