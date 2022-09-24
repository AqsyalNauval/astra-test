import axios from 'axios'
import URL from './url'

const API = {};

const headersWithToken = (token) => {
    return {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
}


API.authRegister = async (datas) => {
    const url = `${URL.registerAPI}`
    const { data } = await axios.post(url, datas)
    return data;
}

API.authLogin = async (datas) => {
    const url = `${URL.loginAPI}`
    const { data } = await axios.post(url, datas)
    return data;
}

API.getArticles = async (token, page) => {

    const url = `${URL.articlesAPI}?pagination%5bpageSize%5d=10&pagination%5bpage%5d=${page}`
    const { data } = await axios.get(url, headersWithToken(token))
    return data;
}

API.getDetailArticles = async (token, id) => {
    const url = `${URL.articlesAPI}/${id}`
    const { data } = await axios.get(url, headersWithToken(token))
    return data;
}

API.createArticles = async (token, datas) => {
    const url = `${URL.articlesAPI}`
    const { data } = await axios.post(url, datas, headersWithToken(token))
    return data;
}

API.deleteArticles = async (token, id) => {
    const url = `${URL.articlesAPI}/${id}`
    const { data } = await axios.delete(url, headersWithToken(token))
    return data;
}

API.updateArticles = async (token, datas, id) => {
    const url = `${URL.articlesAPI}/${id}`
    const { data } = await axios.put(url, datas, headersWithToken(token))
    return data;
}


export default API;