import { useCreateOrUpdateDraftPoll, useCreatePoll, useDeletePoll, useGetDraftPoll } from "@/hooks/usePoll";
import { combineDateTime, formatShortDate } from "@/utils/time";
import { pollSchema } from "@/validation/pollSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DateTimeValues = {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
};

export type PollFormData = z.infer<typeof pollSchema>;

export function usePollForm() {
  const router = useRouter();
  const {
    mutate: createPollMutation,
    data: poll,
    isPending: isCreatingPoll,
    error: createPollError,
  } = useCreatePoll();

  const { 
    data: draftPoll,
    isLoading: isLoadingDraft,
  } = useGetDraftPoll();

  const {
    mutate: createOrUpdateDraftPoll,
    isPending: isSavingDraft,
  } = useCreateOrUpdateDraftPoll();

  const { 
    mutate: deletePoll,
    isPending: isDeletingPoll,
  } = useDeletePoll();
  
  // Has form data been changed
  const [hasFormChanged, setHasFormChanged] = useState(false);
  
  // Date initialization
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const today = new Date(currentYear, currentMonth, currentDay);
  const nextWeek = new Date(currentYear, currentMonth, currentDay + 6);

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
    formState: { errors, isDirty },
    getValues,
    trigger,
    setError,
    clearErrors,
    reset,
  } = form;

  // Watch for changes to form values
  const watchedOptions = watch("options");
  const watchedTags = watch("tags");
  const watchedDescription = watch("description");
  const watchedValues = watch();

  // Form state
  const [tagInput, setTagInput] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [pollCreatedModalOpen, setPollCreatedModalOpen] = useState(false);
  const [hasDraftPoll, setHasDraftPoll] = useState(false);
  const [draftPollId, setDraftPollId] = useState<number | undefined>(undefined);

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
  
  // Timer ref for auto-saving
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft poll when the component mounts
  useEffect(() => {
    if (draftPoll && !isLoadingDraft) {
      setHasDraftPoll(true);
      setDraftPollId(draftPoll.pollId);

      // Set form values from the draft poll
      if (draftPoll.title) setValue("title", draftPoll.title);
      if (draftPoll.description) setValue("description", draftPoll.description);
      if (draftPoll.options && draftPoll.options.length >= 2) {
        setValue("options", draftPoll.options);
      }
      if (draftPoll.tags && Array.isArray(draftPoll.tags)) {
        setValue("tags", draftPoll.tags);
      }
      if (draftPoll.isAnonymous !== undefined) {
        setValue("isAnonymous", draftPoll.isAnonymous);
      }
      
      // Reset form change state after loading draft
      setHasFormChanged(false);
    }
  }, [draftPoll, isLoadingDraft, setValue]);

  // Check for form changes that would trigger draft saving
  useEffect(() => {
    if (isDirty) {
      setHasFormChanged(true);
    }
  }, [watchedValues, isDirty]);

  // Autosave form changes after 20 seconds of inactivity
  useEffect(() => {
    if (hasFormChanged) {
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set a new timer
      autoSaveTimerRef.current = setTimeout(() => {
        saveDraftPoll();
      }, 20000); // 20 seconds
    }

    // Cleanup timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [watchedValues, hasFormChanged]);

  // Add event listener for beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormChanged) {
        // Auto-save before unloading
        saveDraftPoll();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasFormChanged]);

  // Function to intercept the back navigation
  const handleBackNavigation = () => {
    if (hasFormChanged) {
      // Show the draft modal
      setDraftModalOpen(true);
      return;
    }
    
    // Just navigate back if no changes
    router.back();
  };

  // Function to save the draft poll
  const saveDraftPoll = () => {
    const currentValues = getValues();
    
    const draftData = {
      ...(draftPollId ? { pollId: draftPollId } : {}),
      title: currentValues.title || undefined,
      description: currentValues.description || undefined,
      options: currentValues.options.filter(opt => opt.trim() !== "") || undefined,
      tags: currentValues.tags || undefined,
      isAnonymous: currentValues.isAnonymous,
    };
    
    // Don't save if there's no meaningful data
    const hasData = draftData.title || 
                    draftData.description || 
                    (draftData.options && draftData.options.length > 0) ||
                    (draftData.tags && draftData.tags.length > 0);
    
    if (hasData) {
      createOrUpdateDraftPoll(draftData);
    }
  };

  // Function to delete the draft poll
  const deleteDraftPoll = () => {
    if (draftPollId) {
      deletePoll({ id: draftPollId });
      setHasDraftPoll(false);
      setDraftPollId(undefined);
      reset(); // Reset the form
    }
    
    // Navigate back
    router.back();
  };

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
      
      // If we had a draft, it's now published so we can clear it
      if (hasDraftPoll && draftPollId) {
        deletePoll({ id: draftPollId });
        setHasDraftPoll(false);
        setDraftPollId(undefined);
      }
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
    // Handle case where multiple tags are entered with commas, spaces, or new lines
    const allTags = tag
      .split(/[,\s\n]/) // Split on commas, whitespace, or newlines
      .map(t => t.trim().toLowerCase())
      .filter(t => t !== ''); // Filter out empty strings, but keep all potential tags
    
    if (allTags.length === 0) return;
    
    // Check if any of the tags are too short
    const shortTags = allTags.filter(t => t.length > 0 && t.length < 3);
    if (shortTags.length > 0) {
      setError("tags", {
        message: `Tag${shortTags.length > 1 ? 's' : ''} "${shortTags.join(', ')}" must be at least 3 characters`,
      });
      setTagInput(""); // Clear input after showing error
      return;
    }
    
    // All tags are valid, proceed to add them
    const validTags = allTags.filter(t => t.length >= 3);
    const newTags = [...watchedTags];
    
    for (const tagToAdd of validTags) {
      if (
        tagToAdd &&
        !newTags.includes(tagToAdd) &&
        newTags.length < 5 &&
        tagToAdd.length <= 20 // Only add tags that don't exceed max length
      ) {
        newTags.push(tagToAdd);
      }
      
      // Stop adding tags once we reach the limit
      if (newTags.length >= 5) break;
    }
    
    if (newTags.length !== watchedTags.length) {
      setValue("tags", newTags);
      setTagInput("");
      trigger("tags");
    } else {
      setTagInput(""); // Clear the input even if no tags were added
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
    handleBackNavigation,
    saveDraftPoll,
    deleteDraftPoll,
    hasFormChanged,
    isLoadingDraft,
  };
}
