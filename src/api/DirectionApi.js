const URL = "https://api.mapbox.com/directions/v5/mapbox"
const accessToken ="pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl5ZDZhbzcxY2s3Mm5zbG1taWZ1MDBjIn0.1nOWIuN47R6lsU1QXp40KQ"

export const getRoute = async (origin, dest) => {
    try {
        const res = await fetch(
            `${URL}/driving/${origin[0]},${origin[1]};${dest?.longitude},${dest?.latitude}?alternatives=true&annotations=distance,duration,speed&geometries=geojson&language=en&overview=full&steps=true&access_token=${accessToken}`
        );
        console.log(res)
        return await res.json();
    }catch (e) {
        console.log(e)
    }
};
