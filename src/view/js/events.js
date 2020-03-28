let schedule = [];
const getSchedule = async() => {
    try {
        const postOptions = {
            withCredentials: true
        };
        const res = await axios.post('/api/events', { cal_id: "ankh@flexphere.com" }, postOptions);
        schedule = res.data;
    } catch (e) {
        console.log(e);
        location.href = '/';
    }
};

const vueInit = () => {
    const app = new Vue({
        el: '#app',
        data: {
            message: 'Events.html',
            schedule: schedule
        },
        methods: {

        }
    });
}

getSchedule().then(vueInit);