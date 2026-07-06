import React, { useState } from 'react';
import { ReminderEvent } from '../../shared/types';

interface Props {
  event: ReminderEvent | null;
  onSave: (data: Omit<ReminderEvent, 'id'>) => void;
  onCancel: () => void;
}

function toHms(totalSeconds: number) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const hourOptions = Array.from({ length: 24 }, (_, i) => i);
const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
const secondOptions = Array.from({ length: 60 }, (_, i) => i);
const MIN_INTERVAL = 10;

export function EventForm({ event, onSave, onCancel }: Props) {
  const init = event ? toHms(event.intervalSeconds) : { hours: 0, minutes: 5, seconds: 0 };
  const [name, setName] = useState(event?.name || '');
  const [hours, setHours] = useState(init.hours);
  const [minutes, setMinutes] = useState(init.minutes);
  const [seconds, setSeconds] = useState(init.seconds);
  const [startTime, setStartTime] = useState(event?.startTime || '08:00');
  const [endTime, setEndTime] = useState(event?.endTime || '23:00');

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const tooShort = totalSeconds < MIN_INTERVAL;
  const isZeroInterval = totalSeconds === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || totalSeconds < MIN_INTERVAL) return;
    onSave({
      name: name.trim(),
      intervalSeconds: totalSeconds,
      startTime,
      endTime,
      enabled: event?.enabled ?? true,
      // 不传递 lastTriggeredAt，让调度器管理它，避免编辑时覆盖调度器更新的时间戳
    });
  };

  const getHintText = () => {
    if (isZeroInterval) {
      return '⚠️ 间隔时间不能为 0，请输入有效的时间间隔';
    }
    if (tooShort) {
      return '⚠️ 间隔时间不能小于 10 秒';
    }
    const parts: string[] = [];
    if (hours > 0) parts.push(hours + ' 小时');
    if (minutes > 0) parts.push(minutes + ' 分');
    if (seconds > 0 || parts.length === 0) parts.push(seconds + ' 秒');
    return '每 ' + parts.join(' ') + ' 提醒一次';
  };

  const hintText = getHintText();
  const showError = tooShort || isZeroInterval;

  return (
    <div className='form-overlay' onClick={onCancel}>
      <div className='form-card' onClick={e => e.stopPropagation()}>
        <h2>{event ? '编辑事件' : '添加事件'}</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>事件名称</label>
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='例如：喝水'
              autoFocus
              required
            />
          </div>

          <div className='form-group'>
            <label>间隔时间</label>
            <div className='interval-picker'>
              <div className='interval-col'>
                <select value={hours} onChange={e => setHours(Number(e.target.value))}>
                  {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className='interval-label'>小时</span>
              </div>
              <div className='interval-col'>
                <select value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
                  {minuteOptions.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                </select>
                <span className='interval-label'>分</span>
              </div>
              <div className='interval-col'>
                <select value={seconds} onChange={e => setSeconds(Number(e.target.value))}>
                  {secondOptions.map(s => <option key={s} value={s}>{String(s).padStart(2, '0')}</option>)}
                </select>
                <span className='interval-label'>秒</span>
              </div>
            </div>
            <div className='interval-hint' style={showError ? { color: '#e74c3c', background: '#fde8e5' } : {}}>
              {hintText}
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>开始时间</label>
              <input type='time' value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className='form-group'>
              <label>结束时间</label>
              <input type='time' value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className='form-actions'>
            <button type='button' className='btn-cancel' onClick={onCancel}>取消</button>
            <button type='submit' className='btn-save' disabled={showError}>
              {event ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
