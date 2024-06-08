import { useState } from "react";
import { FormWrapper } from "./formWrapper"
import { AgeComparison, AgeUnit, AgeType, CategoryType, DoesntHaveType, EmailInType, EmailIsType, FromType, HasType, LabelsType, SizeComparison, SizeType, SizeUnit, TimeComparison, TimeType, TitleType, ToType } from "@/app/lib/definitions";
type TaskData = {
  from: FromType;
  to: ToType;
  title: TitleType;
  emailIs: EmailIsType;
  doesntHave: DoesntHaveType;
  has: HasType;
  labels: LabelsType;
  category: CategoryType;
  size: SizeType;
  age: AgeType;
  time: TimeType;
  emailIn: EmailInType;
}
type TaskFormProps = TaskData & {
  updateFields: (fields: Partial<TaskData>) => void;
}

export function TaskForm({
  from,
  to,
  title,
  emailIs,
  doesntHave,
  has,
  labels,
  category,
  size,
  age,
  time,
  emailIn,
  updateFields
}: TaskFormProps) {
  const handleMultipleSelect = (e: React.ChangeEvent<HTMLSelectElement>, obj: EmailInType | EmailIsType | HasType | CategoryType) => {
    const key = e.target.name as keyof TaskData;
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    updateFields({ [key]: { ...obj, [key]: value } });
  }
  return (
    <FormWrapper title="Task Details">
      <div className="flex items-center space-x-4">
        <input 
          type="checkbox" 
          id="enableFrom" 
          checked={from.enabled} 
          onChange={() => updateFields({ from: { ...from, enabled: !from.enabled } })}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
          />
        <label htmlFor="from" className="w-24 text-sm font-medium text-gray-700">From</label>
        <input
          type="text"
          id="from"
          name="from"
          disabled={!from.enabled}
          required={from.enabled}
          value={from.from}
          onChange={(e) => updateFields({ from: { ...from, from: e.target.value } })}
          className="flex-1 border border-gray-300 rounded-md p-2" 
          />
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableTo" checked={to.enabled} onChange={() => updateFields({ to: { ...to, enabled: !to.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="to" className="w-24 text-sm font-medium text-gray-700">To</label>
        <input
          type="text"
          id="to"
          name="to"
          disabled={!to.enabled}
          required={to.enabled}
          value={to.to}
          onChange={(e) => updateFields({ to: { ...to, to: e.target.value } })}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableTitle" checked={title.enabled} onChange={() => updateFields({ title: { ...title, enabled: !title.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="title" className="w-24 text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          disabled={!title.enabled}
          required={title.enabled}
          value={title.title}
          onChange={(e) => updateFields({ title: { ...title, title: e.target.value } })}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableIs" checked={emailIs.enabled} onChange={() => updateFields({ emailIs: { ...emailIs, enabled: !emailIs.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="emailIs" className="w-24 text-sm font-medium text-gray-700">Emails are?</label>
        <select
          name="emailIs"
          id="emailIs"
          disabled={!emailIs.enabled}
          required={emailIs.enabled}
          value={emailIs.emailIs}
          onChange={(e) => handleMultipleSelect(e, emailIs)}
          className="flex-1 border border-gray-300 rounded-md p-2"
          multiple
        >
          <option value="unread">unread</option>
          <option value="read">read</option>
          <option value="starred">starred</option>
          <option value="important">important</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableDoesntHave" checked={doesntHave.enabled} onChange={() => updateFields({ doesntHave: { ...doesntHave, enabled: !doesntHave.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="doesntHave" className="w-24 text-sm font-medium text-gray-700">Doesn&apos;t have</label>
        <input
          type="text"
          id="doesntHave"
          name="doesntHave"
          disabled={!doesntHave.enabled}
          required={doesntHave.enabled}
          value={doesntHave.doesntHave}
          onChange={(e) => updateFields({ doesntHave: { ...doesntHave, doesntHave: e.target.value } })}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableHas" checked={has.enabled} onChange={() => updateFields({ has: { ...has, enabled: !has.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="has" className="w-24 text-sm font-medium text-gray-700">Has</label>
        <select
          name="has"
          id="has"
          disabled={!has.enabled}
          required={has.enabled}
          value={has.has}
          onChange={(e) => handleMultipleSelect(e, has)}
          className="flex-1 border border-gray-300 rounded-md p-2"
          multiple
        >
          <option value="attachment">attachment</option>
          <option value="drive">drive</option>
          <option value="document">document</option>
          <option value="spreadsheet">spreadsheet</option>
          <option value="presentation">presentation</option>
          <option value="image">image</option>
          <option value="video">video</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableLabel" checked={labels.enabled} onChange={() => updateFields({ labels: { ...labels, enabled: !labels.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="labels" className="w-24 text-sm font-medium text-gray-700">Labels</label>
        <input
          type="text"
          id="labels"
          name="labels"
          disabled={!labels.enabled}
          required={labels.enabled}
          value={labels.labels}
          onChange={(e) => updateFields({ labels: { ...labels, labels: e.target.value } })}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableCategory" checked={category.enabled} onChange={() => updateFields({ category: { ...category, enabled: !category.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="category" className="w-24 text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          id="category"
          disabled={!category.enabled}
          required={category.enabled}
          value={category.category}
          onChange={(e) => handleMultipleSelect(e, category)}
          className="flex-1 border border-gray-300 rounded-md p-2"
          multiple
        >
          <option value="primary">primary</option>
          <option value="social">social</option>
          <option value="updates">updates</option>
          <option value="promotions">promotions</option>
          <option value="forums">forums</option>
          <option value="reservations">reservations</option>
          <option value="purchases">purchases</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableSize" checked={size.enabled} onChange={() => updateFields({ size: { ...size, enabled: !size.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="size" className="w-24 text-sm font-medium text-gray-700">Size</label>
        <select
          id="sizeComparison"
          name="sizeComparison"
          disabled={!size.enabled}
          required={size.enabled}
          value={size.size.comparison}
          onChange={(e) => updateFields({ size: { ...size, size: { ...size.size, comparison: e.target.value as SizeComparison } } })}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="greate than">greater than</option>
          <option value="less than">less than</option>
        </select>
        <input 
          type="number" 
          id="size" 
          name="size" 
          min="1" 
          value={size.size.value}
          disabled={!size.enabled} 
          required={size.enabled}
          onChange={(e) => updateFields({ size: { ...size, size: { ...size.size, value: Number(e.target.value) } } })}
          className="flex-1 border border-gray-300 rounded-md p-2" 
          />
        <select
          id="sizeUnit"
          name="sizeUnit"
          disabled={!size.enabled}
          required={size.enabled}
          value={size.size.unit}
          onChange={(e) => updateFields({ size: { ...size, size: { ...size.size, unit: e.target.value as SizeUnit } } })}
          className="w-24 border border-gray-300 rounded-md p-2"
        >
          <option value="MB">MB</option>
          <option value="KB">KB</option>
          <option value="Bytes">Bytes</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableAge" checked={age.enabled} onChange={() => updateFields({ age: { ...age, enabled: !age.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="age" className="w-24 text-sm font-medium text-gray-700">Age</label>
        <select
          id="ageComparison"
          name="ageComparison"
          disabled={!age.enabled}
          required={age.enabled}
          value={age.age.comparison}
          onChange={(e) => updateFields({ age: { ...age, age: { ...age.age, comparison: e.target.value as AgeComparison } } })}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="older than">older than</option>
          <option value="newer than">newer than</option>
        </select>
        <input 
          type="number" 
          id="age" 
          name="age" 
          min="1" 
          value={age.age.value}
          disabled={!age.enabled} 
          required={age.enabled}
          onChange={(e) => updateFields({ age: { ...age, age: { ...age.age, value: Number(e.target.value) } } })}
          className="flex-1 border border-gray-300 rounded-md p-2" 
          />
        <select
          id="ageUnit"
          name="ageUnit"
          disabled={!age.enabled}
          required={age.enabled}
          value={age.age.unit}
          onChange={(e) => updateFields({ age: { ...age, age: { ...age.age, unit: e.target.value as AgeUnit } } })}
          className="w-24 border border-gray-300 rounded-md p-2"
        >
          <option value="days">days</option>
          <option value="months">months</option>
          <option value="years">years</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableTime" checked={time.enabled} onChange={() => updateFields({ time: { ...time, enabled: !time.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="time" className="w-24 text-sm font-medium text-gray-700">Time</label>
        <select
          id="timeComparison"
          name="timeComparison"
          disabled={!time.enabled}
          required={time.enabled}
          value={time.time.comparison}
          onChange={(e) => updateFields({ time: { ...time, time: { ...time.time, comparison: e.target.value as TimeComparison } } })}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="after">after</option>
          <option value="before">before</option>
        </select>
        <input
          type="date"
          id="time"
          name="time"
          disabled={!time.enabled}
          required={time.enabled}
          value={time.time.value}
          onChange={(e) => updateFields({ time: { ...time, time: { ...time.time, value: e.target.value } } })}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <input type="checkbox" id="enableIn" checked={emailIn.enabled} onChange={() => updateFields({ emailIn: { ...emailIn, enabled: !emailIn.enabled } })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="emailIn" className="w-24 text-sm font-medium text-gray-700">Emails in?</label>
        <select
          name="emailIn"
          id="emailIn"
          disabled={!emailIn.enabled}
          required={emailIn.enabled}
          value={emailIn.emailIn}
          onChange={(e) => handleMultipleSelect(e, emailIn)}
          className="flex-1 border border-gray-300 rounded-md p-2"
          multiple
        >
          <option value="inbox">inbox</option>
          <option value="draft">draft</option>
          <option value="sent">sent</option>
          <option value="chats">chats</option>
          <option value="scheduled">scheduled</option>
        </select>
      </div>
    </FormWrapper>
  )
}