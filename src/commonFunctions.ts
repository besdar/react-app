export const openLoginPage = () => {
    document.cookie = 'old_page=' + encodeURIComponent(window.location.pathname) +';path=/;expires=' + (new Date((new Date()).getTime() + 18000000)).toUTCString();
    window.location.href = 'login';
}