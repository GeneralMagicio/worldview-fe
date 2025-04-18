import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { usePoll } from "@/hooks/usePoll";
import { pollSchema } from "@/validation/pollSchemas";
import { combineDateTime, formatShortDate } from "@/utils/time";
import { useAuth } from "@/context/AuthContext";

type DateTimeValues = {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
};

export type PollFormData = z.infer<typeof pollSchema>;

export function usePollForm() {
  const { worldID } = useAuth();
  const { createPoll } = usePoll();
  const {
    mutate: createPollMutation,
    data: poll,
    isPending: isCreatingPoll,
    error: createPollError,
  } = createPoll;

  // Date initialization
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const tomorrow = new Date(currentYear, currentMonth, currentDay + 1);
  const nextWeek = new Date(currentYear, currentMonth, currentDay + 7);

  // Form setup
  const form = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      worldID: worldID ?? "",
      title: "",
      description: "",
      options: ["", ""],
      startDate: tomorrow.toISOString(),
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

  // Date time state
  const [duration, setDuration] = useState<24 | 48 | "custom">(24);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<DateTimeValues>({
    startDate: tomorrow,
    endDate: nextWeek,
    startTime: "13:00",
    endTime: "18:00",
  });
  const [customDateRange, setCustomDateRange] = useState<string | null>(null);
  const [customTimeRange, setCustomTimeRange] = useState<string | null>(null);

  // Set world ID
  useEffect(() => {
    setValue("worldID", worldID || "");
  }, [setValue, worldID]);

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

  const setDateRange = (duration: 24 | 48 | "custom", endDate: Date) => {
    const now = new Date();

    const formattedStartDate = formatISO(
      new Date(new Date().setMinutes(now.getMinutes() + 2))
    );
    let formattedEndDate: string = "";

    if (duration === 48) {
      formattedEndDate = formatISO(
        new Date(new Date().setHours(new Date().getHours() + 48))
      );
    }

    if (duration === 24) {
      formattedEndDate = formatISO(
        new Date(new Date().setHours(new Date().getHours() + 24))
      );
    }

    if (duration === "custom") {
      if (endDate < now) {
        setGeneralError("End date cannot be before start date");
        return { formattedStartDate: "", formattedEndDate: "" };
      }
      formattedEndDate = formatISO(endDate);
    }

    return { formattedStartDate, formattedEndDate };
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
