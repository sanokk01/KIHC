"use client";

import { useMemo, useState } from "react";
import type { EventRecord } from "../lib/content";
import { AppLink as Link } from "./AppLink";

type CalendarEvent = EventRecord & { date: Date };

function parseEventDate(value: string) {
  const match = value.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function initialCalendarMonth(events: CalendarEvent[]) {
  const latest = [...events].sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.date;
  return latest ? new Date(latest.getFullYear(), latest.getMonth(), 1) : new Date(2026, 0, 1);
}

export function HomeEventCalendar({ events, inline = false }: { events: EventRecord[]; inline?: boolean }) {
  const parsedEvents = useMemo(
    () => events.flatMap((event) => {
      const date = parseEventDate(event.heldAt);
      return date ? [{ ...event, date }] : [];
    }),
    [events],
  );
  const [visibleMonth, setVisibleMonth] = useState(() => initialCalendarMonth(parsedEvents));
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthEvents = parsedEvents.filter((event) => event.date.getFullYear() === year && event.date.getMonth() === month);
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const moveMonth = (amount: number) => setVisibleMonth(new Date(year, month + amount, 1));

  const calendarContent = (
    <>
      <div className="news-events-cal-head">
        <div>
          <p className="eyebrow">Schedule</p>
          <h2 id="home-events-title">행사일정</h2>
          <p className="news-events-desc">KIHC의 세미나, 간담회와 연구 교류 일정을 확인하세요.</p>
        </div>
        <Link prefetch={false} className="text-link" href="/events">전체 행사 보기 <span aria-hidden="true">→</span></Link>
      </div>
      <div className="home-calendar-layout">
        <div className="home-calendar" aria-label={`${year}년 ${month + 1}월 행사 달력`}>
          <div className="calendar-toolbar">
            <button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">‹</button>
            <strong>{year}. {String(month + 1).padStart(2, "00")}</strong>
            <button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">›</button>
          </div>
          <div className="calendar-weekdays" aria-hidden="true">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-days">
            {cells.map((day, index) => {
              const dayEvents = day ? monthEvents.filter((event) => event.date.getDate() === day) : [];
              return (
                <div className={`calendar-day ${dayEvents.length ? "has-event" : ""}`} key={`${year}-${month}-${index}`}>
                  {day ? <><span>{day}</span>{dayEvents.map((event) => <Link prefetch={false} href={`/events/${event.slug}`} aria-label={`${day}일 ${event.title}`} title={event.title} key={event.id}>{event.eventType}</Link>)}</> : null}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="calendar-event-list" aria-label="선택한 달의 행사">
          <div className="calendar-list-title"><span>{String(month + 1).padStart(2, "0")}월</span><strong>{monthEvents.length}건의 일정</strong></div>
          {monthEvents.length ? monthEvents.map((event) => (
            <Link prefetch={false} href={`/events/${event.slug}`} key={event.id}>
              <time>{String(event.date.getDate()).padStart(2, "0")}</time>
              <div><span>{event.eventType}</span><strong>{event.title}</strong></div>
              <i aria-hidden="true">→</i>
            </Link>
          )) : <p className="calendar-empty">등록된 행사가 없습니다.<br />이전·다음 달 버튼으로 다른 일정을 확인할 수 있습니다.</p>}
        </aside>
      </div>
    </>
  );

  if (inline) {
    return <div className="news-events-col news-events-col--calendar">{calendarContent}</div>;
  }

  return (
    <section className="section home-events-section" aria-labelledby="home-events-title">
      <div className="container">
        <div className="section-heading compact home-events-heading">
          <div>
            <p className="eyebrow">Schedule</p>
            <h2 id="home-events-title">행사일정</h2>
            <p className="section-subcopy">KIHC의 세미나, 간담회와 연구 교류 일정을 확인하세요.</p>
          </div>
          <Link prefetch={false} className="text-link" href="/events">전체 행사 보기 <span aria-hidden="true">→</span></Link>
        </div>
        <div className="home-calendar-layout">
          <div className="home-calendar" aria-label={`${year}년 ${month + 1}월 행사 달력`}>
            <div className="calendar-toolbar">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">‹</button>
              <strong>{year}. {String(month + 1).padStart(2, "0")}</strong>
              <button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">›</button>
            </div>
            <div className="calendar-weekdays" aria-hidden="true">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="calendar-days">
              {cells.map((day, index) => {
                const dayEvents = day ? monthEvents.filter((event) => event.date.getDate() === day) : [];
                return (
                  <div className={`calendar-day ${dayEvents.length ? "has-event" : ""}`} key={`${year}-${month}-${index}`}>
                    {day ? <><span>{day}</span>{dayEvents.map((event) => <Link prefetch={false} href={`/events/${event.slug}`} aria-label={`${day}일 ${event.title}`} title={event.title} key={event.id}>{event.eventType}</Link>)}</> : null}
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="calendar-event-list" aria-label="선택한 달의 행사">
            <div className="calendar-list-title"><span>{String(month + 1).padStart(2, "0")}월</span><strong>{monthEvents.length}건의 일정</strong></div>
            {monthEvents.length ? monthEvents.map((event) => (
              <Link prefetch={false} href={`/events/${event.slug}`} key={event.id}>
                <time>{String(event.date.getDate()).padStart(2, "0")}</time>
                <div><span>{event.eventType}</span><strong>{event.title}</strong></div>
                <i aria-hidden="true">→</i>
              </Link>
            )) : <p className="calendar-empty">등록된 행사가 없습니다.<br />이전·다음 달 버튼으로 다른 일정을 확인할 수 있습니다.</p>}
          </aside>
        </div>
      </div>
    </section>
  );
}
