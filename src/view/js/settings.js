let calendars = [];
const getCalendars = async() => {
    try {
        const postOptions = {
            withCredentials: true
        };
        const res = await axios.post('/api/calendars', {}, postOptions);
        calendars = res.data;
    } catch (e) {
        console.log(e);
        location.href = '/';
    }
};

const vueInit = () => {
    const app = new Vue({
        el: '#app',
        data: {
            message: 'Settings.html',
            calendars: calendars
        },
        methods: {

        }
    });
}

getCalendars().then(vueInit);