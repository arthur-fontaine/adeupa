const getLocation = (positionOptions?: Partial<PositionOptions>): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    const options: PositionOptions = {
      ...{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
      ...positionOptions,
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
