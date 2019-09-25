
export default function getHeaders(): HeadersInit {
    const token = sessionStorage.getItem('jwt');
    const headers = new Headers();
    if (token) {headers.append('Authorization', 'Bearer ' + token)};
    return headers;
}