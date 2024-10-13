import { useState } from "react";
import { FormWrapper } from "./formWrapper"
import { OccurrenceType } from "@/app/lib/definitions";
import { isEndDateLarger, isScheduleOneTime } from "@/app/utils/form";
import timezones from "timezones-list";

type ScheduleData = {
  name: string;
  description: string;
  occurrence: OccurrenceType;
};

type ScheduleFormProps = ScheduleData & {
  updateFields: (fields: Partial<ScheduleData>) => void;
  isEditing?: boolean;
}
export function ScheduleForm({
  name,
  description,
  occurrence,
  updateFields,
  isEditing
}: ScheduleFormProps) {
  const [error, setError] = useState<string | null>(null);
  const validateDates = (startDate: string, endDate: string) => {
    if (!isEndDateLarger(startDate, endDate)) {
      setError('End date must be later than start date');
    } else {
      setError(null);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    if (!isScheduleOneTime(occurrence.Schedule)) {
      validateDates(newStartDate, occurrence.Schedule.endDate);
      updateFields({ occurrence: { ...occurrence, Schedule: { ...occurrence.Schedule, startDate: newStartDate } } });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    if (!isScheduleOneTime(occurrence.Schedule)) {
      validateDates(occurrence.Schedule.startDate, newEndDate);
      updateFields({ occurrence: { ...occurrence, Schedule: { ...occurrence.Schedule, endDate: newEndDate } } });
    }
  };


  const updateRecurringSchedule = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
    if (!isScheduleOneTime(occurrence.Schedule)) {
      updateFields({ occurrence: { ...occurrence, Schedule: { ...occurrence.Schedule, rate: { ...occurrence.Schedule.rate, [key]: parseInt(e.target.value) } } } });
    }
  }
  return (
    <FormWrapper title="Schedule Details">
      {/* Schedule Detail */}
      {/* Name */}
      <div className="flex items-center space-x-4">
        <label htmlFor="name" className="w-24 text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={isEditing}
          placeholder="Enter your schedule name"
          value={name}
          onChange={(e) => updateFields({ name: e.target.value })}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>
      {/* Description */}
      <div className="flex items-center space-x-4">
        <label htmlFor="description" className="w-24 text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Enter your schedule description"
          value={description}
          onChange={(e) => updateFields({ description: e.target.value })}
          className="flex-1 border border-gray-300 rounded-md p-2" />
      </div>
      {/* Schedule */}
      <div className="flex items-center space-x-4">
        <input
          type="radio"
          id="oneTime"
          name="occurrence"
          checked={occurrence.Occurrence === 'One-time'}
          onChange={(e) => updateFields({ occurrence: { ...occurrence, Occurrence: 'One-time', Schedule: occurrence.temp || { date: '', time: '' }, temp: occurrence.Schedule } })}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="oneTime" className="text-sm font-medium text-gray-700">One time Schedule</label>
        <input
          type="radio"
          id="recurring"
          name="occurrence"
          checked={occurrence.Occurrence === 'Recurring'}
          onChange={(e) => updateFields({ occurrence: { ...occurrence, Occurrence: 'Recurring', Schedule: occurrence.temp || { rate: { value: 90, unit: 'days' }, startDate: '', endDate: '' }, temp: occurrence.Schedule } })}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="recurring" className="text-sm font-medium text-gray-700">Recurring Schedule</label>
      </div>
      <div className={"grid grid-cols-3 gap-4 " + ((occurrence.Occurrence === 'One-time') ? 'block' : 'hidden')}>
        <div className="flex items-center space-x-4">
          <label htmlFor="oneTimeTimeZone" className="w-24 text-sm font-medium text-gray-700">Time Zone</label>
          <select
            id="oneTimeTimeZone"
            name="oneTimeTimeZone"
            disabled={!(occurrence.Occurrence === 'One-time')}
            required={(occurrence.Occurrence === 'One-time')}
            value={occurrence.TimeZone}
            onChange={(e) => updateFields({ occurrence: { ...occurrence, TimeZone: e.target.value } })}
            className="flex-1 border border-gray-300 rounded-md p-2">
            {timezones.map((tz) => (
              <option key={tz.tzCode} value={tz.tzCode}>(UTC{tz.utc}) {tz.tzCode}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="oneTimeDate" className="w-24 text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="oneTimeDate"
            name="oneTimeDate"
            disabled={!(occurrence.Occurrence === 'One-time')}
            required={(occurrence.Occurrence === 'One-time')}
            value={isScheduleOneTime(occurrence.Schedule) ? occurrence.Schedule.date : ''}
            onChange={(e) => updateFields({ occurrence: { ...occurrence, Schedule: { ...occurrence.Schedule, date: e.target.value } } })}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="oneTimeTime" className="w-24 text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            id="oneTimeTime"
            name="oneTimeTime"
            disabled={!(occurrence.Occurrence === 'One-time')}
            required={(occurrence.Occurrence === 'One-time')}
            value={isScheduleOneTime(occurrence.Schedule) ? occurrence.Schedule.time : ''}
            onChange={(e) => updateFields({ occurrence: { ...occurrence, Schedule: { ...occurrence.Schedule, time: e.target.value } } })}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      <div className={"grid grid-cols-2 gap-4 " + ((occurrence.Occurrence === 'One-time') ? 'hidden' : 'block')}>
        <div className="flex items-center space-x-4">
          <label htmlFor="repeatRate" className="w-24 text-sm font-medium text-gray-700">Rate</label>
          <input
            type="number"
            id="repeatRate"
            name="repeatRate"
            min="1"
            required={occurrence.Occurrence === 'Recurring'}
            disabled={!(occurrence.Occurrence === 'Recurring')}
            value={isScheduleOneTime(occurrence.Schedule) ? 90 : occurrence.Schedule.rate.value}
            onChange={(e) => updateRecurringSchedule(e, 'value')}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <select
            id="rateUnit"
            name="rateUnit"
            required={occurrence.Occurrence === 'Recurring'}
            disabled={!(occurrence.Occurrence === 'Recurring')}
            value={isScheduleOneTime(occurrence.Schedule) ? 'days' : occurrence.Schedule.rate.unit}
            onChange={(e) => updateRecurringSchedule(e, 'unit')}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="repeatTimeZone" className="w-24 text-sm font-medium text-gray-700">Time Zone</label>
          <select
            id="repeatTimeZone"
            name="repeatTimeZone"
            required={occurrence.Occurrence === 'Recurring'}
            disabled={!(occurrence.Occurrence === 'Recurring')}
            value={occurrence.TimeZone}
            onChange={(e) => updateFields({ occurrence: { ...occurrence, TimeZone: e.target.value } })}
            className="flex-1 border border-gray-300 rounded-md p-2"
          >
            {timezones.map((tz) => (
              <option key={tz.tzCode} value={tz.tzCode}>(UTC{tz.utc}) {tz.tzCode}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={"grid grid-cols-2 gap-4 " + ((occurrence.Occurrence === 'Recurring') ? 'block' : 'hidden')}>
        <div className="flex items-center space-x-4">
          <label htmlFor="repeatStart" className="w-24 text-sm font-medium text-gray-700">Start Time (Optional)</label>
          <input
            type="date"
            id="repeatStart"
            name="repeatStart"
            disabled={!(occurrence.Occurrence === 'Recurring')}
            value={!isScheduleOneTime(occurrence.Schedule) ? occurrence.Schedule.startDate : ''}
            onChange={handleStartDateChange}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="repeatEnd" className="w-24 text-sm font-medium text-gray-700">End Time (Optional)</label>
          <input
            type="date"
            id="repeatEnd"
            name="repeatEnd"
            disabled={!(occurrence.Occurrence === 'Recurring')}
            value={!isScheduleOneTime(occurrence.Schedule) ? occurrence.Schedule.endDate : ''}
            onChange={handleEndDateChange}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </FormWrapper>
  )
}