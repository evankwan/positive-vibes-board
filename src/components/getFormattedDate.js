import getDayOfWeek from './getDayOfWeek'
import getMonthName from './getMonthName'

// utility function to format the date for each message/comment
const getFormattedDate = (currentDate) => {
  const dayOfWeek = getDayOfWeek(currentDate.getDay());
  const month = getMonthName(currentDate.getMonth());
  const dateNumber = currentDate.getDate();
  const year = currentDate.getFullYear();
  const dateString = `${dayOfWeek}, ${month} ${dateNumber}, ${year}`;

  return dateString
}

export default getFormattedDate