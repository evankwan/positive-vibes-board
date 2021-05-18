// utility function to format the day of the week
const getDayOfWeek = (day) => {
  let dayOfWeek;
  switch (day) {
    case 0:
      dayOfWeek = "Sunday"
      break
    case 1:
      dayOfWeek = "Monday"
      break
    case 2:
      dayOfWeek = "Tuesday"
      break
    case 3:
      dayOfWeek = "Wednesday"
      break
    case 4:
      dayOfWeek = "Thursday"
      break
    case 5:
      dayOfWeek = "Friday"
      break
    case 6:
      dayOfWeek = "Saturday"
      break
    default:
      dayOfWeek = ""
  }
  return dayOfWeek
}

export default getDayOfWeek