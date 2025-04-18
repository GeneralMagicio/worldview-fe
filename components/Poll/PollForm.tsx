"use client";

import { type KeyboardEvent } from "react";
import { cn } from "@/utils";
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
import { usePollForm } from "@/hooks/usePollForm";

export default function PollForm() {
  const {
    register,
    errors,
    watchedOptions,
    watchedTags,
    watchedDescription,
    tagInput,
    setTagInput,
    generalError,
    draftModalOpen,
    setDraftModalOpen,
    pollCreatedModalOpen,
    setPollCreatedModalOpen,
    datePickerOpen,
    setDatePickerOpen,
    selectedDateTime,
    customDateRange,
    customTimeRange,
    isCreatingPoll,
    createPollError,
    poll,
    duration,
    getValues,
    form,
    addOption,
    removeOption,
    addTag,
    removeTag,
    setDuration,
    handleDateTimeApply,
    handlePublish,
  } = usePollForm();

  console.log("poll ==> ", poll);

  const BASE_INPUT_CLASSES =
    "flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (
      e.key === "Backspace" &&
      tagInput === "" &&
      watchedTags.length > 0
    ) {
      const newTags = [...watchedTags];
      newTags.pop();
      removeTag(newTags[newTags.length - 1]);
    }
  };

  const renderErrorMessage = (message: string) => (
    <div className="text-error-700 text-sm mt-1 flex items-center justify-end gap-1 error-message">
      <span>{message}</span>
    </div>
  );

  const renderTagsInput = () => (
    <div className="border border-gray-200 rounded-lg p-2 flex flex-wrap items-center gap-2">
      {watchedTags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 bg-white border border-gray-300 px-1 py-0.5 text-sm rounded-md"
        >
          <span className="text-gray-900">{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="focus:outline-none"
          >
            <CloseIcon size={16} color="#9BA3AE" />
          </button>
        </div>
      ))}
      <input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
        placeholder={watchedTags.length === 0 ? "Add tags" : ""}
        className="border-none flex-1 min-w-[100px] p-2 text-gray-900 focus:outline-none"
        disabled={watchedTags.length >= 5}
      />
    </div>
  );

  const renderPollOptions = () => (
    <div className="space-y-3 mb-6">
      {watchedOptions.map((option, index) => (
        <div key={index} className="flex flex-col">
          <div className="flex items-center gap-2">
            <input
              {...register(`options.${index}`)}
              placeholder={`Option ${index + 1}`}
              className={cn(
                BASE_INPUT_CLASSES,
                errors.options?.[index]
                  ? "border-error-700 focus:ring-error-700 focus:border-error-700"
                  : ""
              )}
            />
            {watchedOptions.length > 2 &&
              index === watchedOptions.length - 1 && (
                <button type="button" onClick={() => removeOption(index)}>
                  <XOutlinedIcon />
                </button>
              )}
          </div>
          {errors.options?.[index] &&
            renderErrorMessage(errors.options[index]?.message as string)}
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 text-sm rounded-lg"
      >
        <PlusIcon size={16} color="#191C20" />
        Add option
      </button>

      {errors.options &&
        !Array.isArray(errors.options) &&
        renderErrorMessage(errors.options.message as string)}
    </div>
  );

  const renderDurationSelector = () => (
    <div className="space-y-4">
      <DurationOption
        label="24 hours"
        selected={duration === 24}
        onClick={() => setDuration(24)}
      />
      <DurationOption
        label="48 hours"
        selected={duration === 48}
        onClick={() => setDuration(48)}
      />
      <div className="flex items-center justify-between">
        <span className="text-gray-900">Custom</span>
        {duration === "custom" ? (
          <Button
            type="button"
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
            type="button"
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
    <form onSubmit={form.handleSubmit((data) => {})}>
      <div className="flex-1 bg-white rounded-t-3xl p-4 flex flex-col">
        <div className="space-y-4 mb-6">
          <div>
            <input
              {...register("title")}
              placeholder="Enter poll question"
              className={cn(
                BASE_INPUT_CLASSES,
                errors.title
                  ? "border-error-700 focus:ring-error-700 focus:border-error-700"
                  : ""
              )}
            />
            {errors.title && renderErrorMessage(errors.title.message as string)}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Enter description"
              className={cn(
                BASE_INPUT_CLASSES,
                "min-h-[120px] p-4 text-gray-900"
              )}
            />
            {watchedDescription.length <= 1400 ? (
              <p className="flex items-center justify-end gap-1 text-gray-500 text-sm mt-1">
                {watchedDescription.length}/1400
              </p>
            ) : (
              errors.description &&
              renderErrorMessage(errors.description.message as string)
            )}
          </div>

          <div>
            {renderTagsInput()}
            {watchedTags.length === 5 ? (
              <p className="flex items-center justify-end gap-1 text-gray-500 text-sm mt-1">
                5/5 Tags added
              </p>
            ) : (
              errors.tags &&
              !Array.isArray(errors.tags) &&
              renderErrorMessage(errors.tags.message as string)
            )}
          </div>
        </div>

        {renderPollOptions()}

        <div className="border-t border-gray-200 my-4"></div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900">
            Poll Duration
          </h2>
          {renderDurationSelector()}
          {(errors.startDate || errors.endDate) &&
            renderErrorMessage("Valid start and end dates are required")}
        </div>

        {(generalError || createPollError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
            {generalError || "An error occurred. Please try again."}
          </div>
        )}

        <Button
          type="button"
          className="w-full mt-auto py-4"
          onClick={handlePublish}
          disabled={isCreatingPoll}
        >
          {isCreatingPoll ? "Publishing..." : "Publish Poll"}
        </Button>
      </div>

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
        pollTitle={getValues("title")}
        pollId={poll?.pollId}
      />

      <DraftPollModal
        modalOpen={draftModalOpen}
        setModalOpen={setDraftModalOpen}
      />
    </form>
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
