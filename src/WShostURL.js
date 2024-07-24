export function WShostURL() {
    var host = window.location.hostname;
    var url = 'ws://' + host + ':8080/play';
    console.log("WebSocket host URL Calculada: " + url);
    return url;
}