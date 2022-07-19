import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const RequestHeader = {
    checkAuthHeaders: {
        Authorization: "Bearer " + cookies.get('accessToken'),
        "Content-Type": "application/json",
    },
};
