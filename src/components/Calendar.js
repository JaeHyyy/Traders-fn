import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, addDays, getDay, getWeek, isSameMonth } from 'date-fns';
import '../components/Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getKoreanMonth = (date) => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    return months[date.getMonth()];
  };

  const getDaysInMonth = (date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    let days = [];
    for (let i = 0; i < 35; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  const isHoliday = (date) => {
    const dayOfWeek = getDay(date);
    const weekOfMonth = getWeek(date) - getWeek(startOfMonth(date));
    return dayOfWeek === 0 && (weekOfMonth === 2 || weekOfMonth === 4);
  };

  const days = getDaysInMonth(currentDate);

  const onPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={onPrevMonth} className='cal_btnP'>&lt;</button>
        <h2>{getKoreanMonth(currentDate)} {format(currentDate, 'yyyy')}</h2>
        <button onClick={onNextMonth} className='cal_btnN'>&gt;</button>
      </div>
      <div className="calendar-body">
        <div className="calendar-week-days">
          {['월', '화', '수', '목', '금', '토', '일'].map(day => (
            <div key={day} className="week-day">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map(day => (
            <div
              key={day.toString()}
              className={`calendar-day 
                ${!isSameMonth(day, currentDate) ? 'other-month' : ''} 
                ${isHoliday(day) ? 'holiday' : ''}`
              }
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;