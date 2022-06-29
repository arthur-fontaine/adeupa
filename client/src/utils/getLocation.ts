const getLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }

    const success: PositionCallback = (pos) => {
      const crd = pos.coords
      resolve([crd.latitude, crd.longitude])
    }

    const error: PositionErrorCallback = (err) => {
      reject(err)
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  })
}

export default getLocation
