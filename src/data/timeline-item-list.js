
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const today = dayjs();

const getTimeItem = (
  addDayLength,
  dayInterval
) => {
  const start = today.add(addDayLength, 'day').format('YYYY-MM-DD');
  const end = today.add(addDayLength + ((dayInterval || ~~(Math.random() * 20) + 1)), 'day').format('YYYY-MM-DD');
  const id = uuidv4();
  return {
    id,
    start,
    end,
    name: `Item Name ${start}`,
    color: '#333333'
  };
};

const TimelineItemList = [
  getTimeItem(5, 10),
  getTimeItem(16, 2)
];

('.').repeat(20).split('').forEach(() => {
  TimelineItemList.push(getTimeItem(~~(Math.random() * 60)))
})

export default TimelineItemList;
