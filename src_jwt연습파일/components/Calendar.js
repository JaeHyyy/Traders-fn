import React, { useEffect, useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, addDays, getDay, getWeek, isSameMonth } from 'date-fns';
import '../components/Calendar.css';

const Calendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜를 저장하는 상태
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜를 저장하는 상태

  // 한국어로 된 월 이름을 반환하는 함수
  const getKoreanMonth = (date) => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    return months[date.getMonth()];
  };

  // 해당 월의 날짜들을 반환하는 함수
  const getDaysInMonth = (date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    let days = [];
    for (let i = 0; i < 35; i++) { // 5주(7일*5=35일)를 표현하기 위해 35일을 계산
      days.push(addDays(start, i));
    }
    return days;
  };

  // 특정 날짜가 공휴일인지 확인하는 함수
  const isHoliday = (date) => {
    const dayOfWeek = getDay(date); // 요일을 가져옴 (0: 일요일, 1: 월요일, ...)
    const weekOfMonth = getWeek(date) - getWeek(startOfMonth(date)); // 해당 월의 몇 번째 주인지 계산
    return dayOfWeek === 0 && (weekOfMonth === 2 || weekOfMonth === 4); // 둘째 주, 넷째 주 일요일을 공휴일로 간주
  };

  const days = getDaysInMonth(currentDate); // 현재 월의 날짜들 가져오기

  // 이전 달로 이동하는 함수
  const onPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  // 다음 달로 이동하는 함수
  const onNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // 날짜를 클릭했을 때 실행되는 함수
  const handleDateClick = (date) => {
    setSelectedDate(date); // 선택된 날짜 상태 업데이트
    onDateSelect(date); // 부모 컴포넌트로 선택된 날짜 전달
  };

  // 컴포넌트가 처음 로드될 때 초기 선택된 날짜를 부모 컴포넌트에 전달
  useEffect(()=> {
    onDateSelect(selectedDate);
  }, [onDateSelect, selectedDate]);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={onPrevMonth} className='cal_btnP'>&lt;</button> {/* 이전 달 버튼 */}
        <h2>{getKoreanMonth(currentDate)} {format(currentDate, 'yyyy')}</h2> {/* 현재 월과 연도 표시 */}
        <button onClick={onNextMonth} className='cal_btnN'>&gt;</button> {/* 다음 달 버튼 */}
      </div>
      <div className="calendar-body">
        <div className="calendar-week-days">
          {['월', '화', '수', '목', '금', '토', '일'].map(day => (
            <div key={day} className="week-day">{day}</div> // 요일 표시
          ))}
        </div>
        <div className="calendar-days">
          {days.map(day => (
            <div
              key={day.toString()}
              className={`calendar-day 
                ${!isSameMonth(day, currentDate) ? 'other-month' : ''} // 다른 달의 날짜 표시
                ${isHoliday(day) ? 'holiday' : ''} // 공휴일 표시
                ${selectedDate && day.toDateString() === selectedDate.toDateString() ? 'selected' : ''}` // 선택된 날짜 표시
              }
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')} {/* 날짜 숫자 표시 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;