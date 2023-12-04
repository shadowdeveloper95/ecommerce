import { PUBLIC_BASE_API_URL } from "$env/static/public";
import AccountService from "$lib/(account)/service";
import { SpinnerService } from "$lib/components/share/spinner.svelte";
import { ToastService } from "$lib/components/share/toast.svelte";
import axios, { AxiosError } from "axios";

async function delay(ms = 1500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


/**
 * @param {AxiosError} error
 */
function handleError(error) {
    // TODO: enhance error message and handler
    const response = error.response;
    let errorMessage = error.message;
    if (response) {
        errorMessage = response.data.message
    }
    ToastService.notifyError(errorMessage);
    console.log(error);
}


const httpClient = axios.create({
    baseURL: PUBLIC_BASE_API_URL,
    timeout: 5000
});


const apiClientWithSpinner = axios.create({
    baseURL: PUBLIC_BASE_API_URL,
    timeout: 5000
})

apiClientWithSpinner.interceptors.response.use(async (response) => {
    SpinnerService.showSpinner();
    await delay(1000);
    SpinnerService.hideSpinner();
    return response;
}, handleError)


const apiClientAuthSpinner = axios.create({
    baseURL: PUBLIC_BASE_API_URL,
    timeout: 5000
})

apiClientAuthSpinner.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${AccountService.getAccessToken()}`
    return config;
})

apiClientAuthSpinner.interceptors.response.use(async (response) => {
    SpinnerService.showSpinner();
    await delay(1000);
    SpinnerService.hideSpinner();
    return response;
}, handleError)

export {
    httpClient,
    delay,
    apiClientWithSpinner,
    apiClientAuthSpinner
};