const storedAccessToken = localStorage.getItem('accessToken');

export const fetchCourseDataDetail = async (id) => {
    try {
        const response = await fetch(
            `http://192.168.3.150:8055/flows/trigger/20202c51-f8a4-4204-a479-b0b40f064f90?id=${id}`, {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedAccessToken}`
                }
            }
        );
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching course data:", error);
        throw error;
    }
};
