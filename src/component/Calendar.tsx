import React, { useState } from "react";
import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
} from "date-fns";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();

  const renderHeader = () => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          {"<"}
        </Button>
        <Heading as="h2" size="md">
          {format(currentMonth, "MMM yyyy")}
        </Heading>
        <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          {">"}
        </Button>
      </Box>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days.map((day) => (
      <Box key={day} textAlign="center" fontWeight="bold">
        {day}
      </Box>
    ));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    // Loop through the days from startDate to endDate
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const isToday = isSameDay(currentDay, today);
        const isGrayedOut = isBefore(currentDay, today);
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
        const isFutureOrToday =
          isSameDay(currentDay, today) || isAfter(currentDay, today);

        days.push(
          <Box
            key={day.toISOString()}
            display="flex"
            alignItems="center"
            justifyContent="center"
            h={"70px"}
            m={1}
            bg={isSelected ? "green.400" : isToday ? "gray.500" : "white"}
            color={
              isSelected || isToday
                ? "white"
                : isGrayedOut
                ? "gray.400"
                : "black"
            }
            borderRadius={isSelected || isToday ? "50%" : "none"}
            onClick={() => {
              if (isFutureOrToday) {
                setSelectedDate(currentDay);
              }
            }}
          >
            {isSameMonth(currentDay, currentMonth)
              ? format(currentDay, "d")
              : ""}
          </Box>
        );
        day = addDays(day, 1); // Move to the next day
      }

      // Push the completed row of days into the rows array
      rows.push(
        <Grid key={day.toISOString()} templateColumns="repeat(7, 1fr)">
          {days}
        </Grid>
      );
      days = []; // Reset days for the next week
    }

    return <>{rows}</>;
  };

  return (
    <Box w="full" maxW="600px" mx="auto" p={4}>
      {renderHeader()}
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {renderDaysOfWeek()}
      </Grid>
      {renderCells()}
    </Box>
  );
};

export default Calendar;
