"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import {
  CalendarIcon,
  PlusIcon,
  CheckIcon,
  CloseIcon,
  XOutlinedIcon,
  ClockIcon2,
} from "../icon-components";
import { Button } from "../ui/Button";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import PollCreatedModal from "../Modals/PollCreatedModal";
import DraftPollModal from "../Modals/DraftPollModal";

type DurationType = "24" | "48" | "custom";

type DateTimeValues = {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
};

export default function PollForm() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [duration, setDuration] = useState<DurationType>("24");
  // Success modal state
  const [pollCreatedModalOpen, setPollCreatedModalOpen] = useState(false);

  // Date time state
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<DateTimeValues>({
    startDate: new Date(currentYear, currentMonth, currentDay + 1),
    endDate: new Date(currentYear, currentMonth, currentDay + 7),
    startTime: "13:00",
    endTime: "18:00",
  });
  const [customDateRange, setCustomDateRange] = useState<string | null>(null);
  const [customTimeRange, setCustomTimeRange] = useState<string | null>(null);

  // Options handlers
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Tags handlers
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const handleDateTimeApply = (values: DateTimeValues) => {
    setSelectedDateTime(values);
    setCustomDateRange(
      `${values.startDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} to ${values.endDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    );
    setCustomTimeRange(`${values.startTime} to ${values.endTime}`);
    setDuration("custom");
  };

  const handlePublish = () => {
    console.log({
      question,
      description,
      tags,
      options,
      duration,
      dateTimeSettings: duration === "custom" ? selectedDateTime : duration,
    });
  };

  const renderTagsInput = () => (
    <div className="border border-gray-200 rounded-lg p-2 flex flex-wrap items-center gap-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 bg-white border border-gray-300 px-1 py-0.5 text-sm rounded-md"
        >
          <span className="text-gray-900">{tag}</span>
          <button onClick={() => removeTag(tag)} className="focus:outline-none">
            <CloseIcon size={16} color="#9BA3AE" />
          </button>
        </div>
      ))}
      <input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
        placeholder={tags.length === 0 ? "Add tags" : ""}
        className="border-none flex-1 min-w-[100px] p-2 text-gray-900 focus:outline-none"
      />
    </div>
  );

  const renderPollOptions = () => (
    <div className="space-y-3 mb-6">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="p-4 text-gray-900"
          />
          {index !== 0 && index === options.length - 1 && (
            <button onClick={() => removeOption(index)}>
              <XOutlinedIcon />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addOption}
        className="flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 text-sm rounded-lg"
      >
        <PlusIcon size={16} color="#191C20" />
        Add option
      </button>
    </div>
  );

  const renderDurationSelector = () => (
    <div className="space-y-4">
      <DurationOption
        label="24 hours"
        selected={duration === "24"}
        onClick={() => setDuration("24")}
      />
      <DurationOption
        label="48 hours"
        selected={duration === "48"}
        onClick={() => setDuration("48")}
      />
      <div className="flex items-center justify-between">
        <span className="text-gray-900">Custom</span>
        {duration === "custom" && customDateRange ? (
          <Button
            variant="outline"
            onClick={() => setDatePickerOpen(true)}
            className="flex items-center gap-2 px-3 py-2"
          >
            <div>
              <div className="text-sm font-medium text-gray-900">
                {customDateRange}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                {customTimeRange}
              </div>
            </div>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setDatePickerOpen(true)}
            className="flex items-center gap-2 p-2 px-3 font-normal text-sm"
          >
            <CalendarIcon />
            Select Date & Time
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex-1 bg-white rounded-t-3xl p-4 flex flex-col">
        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Poll Question?"
            className="p-4 text-gray-900"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="p-4 text-gray-900 min-h-[120px]"
          />

          {renderTagsInput()}
        </div>

        {renderPollOptions()}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Poll Duration */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900">
            Poll Duration
          </h2>
          {renderDurationSelector()}
        </div>

        {/* Publish Button */}
        <Button className="w-full mt-auto py-4" onClick={handlePublish}>
          Publish Poll
        </Button>
      </div>

      {/* Date Time Picker */}
      <DateTimePicker
        open={datePickerOpen}
        onOpenChange={setDatePickerOpen}
        onApply={handleDateTimeApply}
        initialStartDate={selectedDateTime.startDate}
        initialEndDate={selectedDateTime.endDate}
        initialStartTime={selectedDateTime.startTime}
        initialEndTime={selectedDateTime.endTime}
      />

      <PollCreatedModal
        open={pollCreatedModalOpen}
        onOpenChange={setPollCreatedModalOpen}
        pollTitle={question}
        pollId={1}
      />

      <DraftPollModal />
    </div>
  );
}

function DurationOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ClockIcon2 />
        <span className="text-gray-900">{label}</span>
      </div>
      <div
        className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer ${
          selected ? "bg-gray-900" : "border border-gray-300"
        }`}
        onClick={onClick}
      >
        {selected && <CheckIcon />}
      </div>
    </div>
  );
}
