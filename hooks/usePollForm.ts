import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { useCreatePoll } from "@/hooks/usePoll";
import { pollSchema } from "@/validation/pollSchemas";
import { combineDateTime, formatShortDate } from "@/utils/time";

type DateTimeValues = {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
};

export type PollFormData = z.infer<typeof pollSchema>;

export function usePollForm() {
  const {
    mutate: createPollMutation,
    data: poll,
    isPending: isCreatingPoll,
    error: createPollError,
  } = useCreatePoll();

  // Date initialization
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const today = new Date(currentYear, currentMonth, currentDay);
  const nextWeek = new Date(currentYear, currentMonth, currentDay + 7);

  // Form setup
  const form = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: ["", ""],
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString(),
      tags: [],
      isAnonymous: false,
    },
    mode: "onChange",
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    trigger,
    setError,
    clearErrors,
  } = form;

  // Watch for changes to form values
  const watchedOptions = watch("options");
  const watchedTags = watch("tags");
  const watchedDescription = watch("description");

  // Form state
  const [tagInput, setTagInput] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [pollCreatedModalOpen, setPollCreatedModalOpen] = useState(false);

  const initialStartTime = new Date().toLocaleTimeString("en-EU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Date time state
  const [duration, setDuration] = useState<24 | 48 | "custom">(24);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<DateTimeValues>({
    startDate: today,
    endDate: nextWeek,
    startTime: initialStartTime,
    endTime: "18:00",
  });
  const [customDateRange, setCustomDateRange] = useState<string | null>(null);
  const [customTimeRange, setCustomTimeRange] = useState<string | null>(null);

  // Check for API errors
  useEffect(() => {
    if (createPollError) {
      setGeneralError("Failed to create poll. Please try again.");
    }
  }, [createPollError]);

  // Display success modal when poll is created
  useEffect(() => {
    if (poll && !isCreatingPoll) {
      setPollCreatedModalOpen(true);
    }
  }, [poll, isCreatingPoll]);

  // Options handlers
  const addOption = () => {
    setValue("options", [...watchedOptions, ""]);
  };

  const removeOption = (index: number) => {
    if (watchedOptions.length > 2) {
      const newOptions = watchedOptions.filter((_, i) => i !== index);
      setValue("options", newOptions);
    }
  };

  // Tags handlers
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (
      trimmedTag &&
      !watchedTags.includes(trimmedTag) &&
      watchedTags.length < 5
    ) {
      const newTags = [...watchedTags, trimmedTag];
      setValue("tags", newTags);
      setTagInput("");
      trigger("tags");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = watchedTags.filter((t) => t !== tag);
    setValue("tags", newTags);
    trigger("tags");
  };

  const handleDateTimeApply = (values: DateTimeValues) => {
    setDuration("custom");

    setSelectedDateTime(values);

    setCustomDateRange(
      `${formatShortDate(values.startDate)} to ${formatShortDate(
        values.endDate
      )}`
    );
    setCustomTimeRange(`${values.startTime} to ${values.endTime}`);

    // Format dates for API
    if (values.startDate && values.startTime) {
      const startDateTime = combineDateTime(values.startDate, values.startTime);
      setValue("startDate", startDateTime.toISOString());
    }

    if (values.endDate && values.endTime) {
      const endDateTime = combineDateTime(values.endDate, values.endTime);
      setValue("endDate", endDateTime.toISOString());
    }
  };

  const setDateRange = (
    duration: 24 | 48 | "custom",
    startDate: Date,
    endDate: Date
  ) => {
    const now = new Date();
    let end: Date;
    let start: Date;

    start = now;

    if (duration === 24) {
      end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (duration === 48) {
      end = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    } else {
      if (startDate === endDate) {
        setGeneralError("Start date and end date cannot be the same");
        return { formattedStartDate: "", formattedEndDate: "" };
      }

      end = endDate;
    }

    return {
      formattedStartDate: formatISO(start),
      formattedEndDate: formatISO(end),
    };
  };

  const onSubmit = (data: PollFormData) => {
    setGeneralError(null);

    const cleanedOptions = data.options.filter(
      (option) => option.trim() !== ""
    );

    if (cleanedOptions.length < 2) {
      setGeneralError("At least 2 non-empty options are required");
      return;
    }

    const { formattedStartDate, formattedEndDate } = setDateRange(
      duration,
      new Date(data.startDate),
      new Date(data.endDate)
    );

    if (!formattedStartDate || !formattedEndDate) return;

    createPollMutation({
      ...data,
      options: cleanedOptions,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  const handlePublish = () => {
    trigger().then((isValid) => {
      if (isValid) {
        handleSubmit(onSubmit)();
      }
    });
  };

  useEffect(() => {
    if (tagInput.length > 20) {
      setError("tags", {
        message: `${tagInput.length}/20 Max tag character limit reached`,
      });
    } else if (tagInput.length < 3 && tagInput.length > 0) {
      setError("tags", {
        message: "Must be at least 3 characters",
      });
    } else {
      clearErrors("tags");
    }
  }, [tagInput]);

  return {
    form,
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
    duration,
    setDuration,
    selectedDateTime,
    customDateRange,
    customTimeRange,
    isCreatingPoll,
    createPollError,
    poll,
    getValues,
    addOption,
    removeOption,
    addTag,
    removeTag,
    handleDateTimeApply,
    handlePublish,
  };
}
