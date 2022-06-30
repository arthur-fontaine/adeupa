type Location = [number, number]

export default (from: Location, to: Location) => {
  const [lat, lng] = from
  const [shopLat, shopLng] = to
  const R = 6371
  const dLat = (shopLat - lat) * (Math.PI / 180)
  const dLng = (shopLng - lng) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat * (Math.PI / 180)) * Math.cos(shopLat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return  R * c
}
