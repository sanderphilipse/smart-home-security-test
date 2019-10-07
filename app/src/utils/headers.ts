
export default function getHeaders(token: string, oldHeaders: Headers | undefined): HeadersInit {
    const headers = oldHeaders ? oldHeaders : new Headers();
    if (token) {headers.append('Authorization', 'Bearer ' + token)};
    return headers;
}