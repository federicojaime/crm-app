// src/components/common/DateRangePickerComponent.jsx
import { useState } from 'react';
import { DateRangePicker } from '@mantine/dates';
import { Box, createStyles, ActionIcon } from '@mantine/core';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Estilos personalizados para el selector de rango de fechas
const useStyles = createStyles((theme) => ({
    calendar: {
        width: '100%',
        '.mantine-DatePicker-calendarHeader': {
            marginBottom: '10px',
        },
        '.mantine-DateRangePicker-monthCell': {
            borderRadius: '4px',
        },
        '.mantine-DateRangePicker-day': {
            borderRadius: '4px',
            height: '36px',
            width: '36px',
            fontSize: '14px',
            '&[data-selected]': {
                backgroundColor: theme.colors.blue[6],
            },
            '&[data-weekend]': {
                color: theme.colors.gray[6],
            },
            '&[data-in-range]': {
                backgroundColor: theme.colors.blue[0],
                color: theme.colors.blue[9],
            },
            '&[data-first-in-range]': {
                backgroundColor: theme.colors.blue[6],
                color: theme.white,
            },
            '&[data-last-in-range]': {
                backgroundColor: theme.colors.blue[6],
                color: theme.white,
            },
        },
        '.mantine-DateRangePicker-weekday': {
            fontSize: '12px',
            color: theme.colors.gray[6],
            fontWeight: 600,
            padding: '8px 0',
        },
        '.mantine-DateRangePicker-monthCell': {
            padding: '5px',
        },
    },
    navigationControl: {
        height: '28px',
        width: '28px',
        borderRadius: '4px',
        color: theme.colors.blue[7],
        backgroundColor: 'transparent',
        border: `1px solid ${theme.colors.gray[3]}`,

        '&:hover': {
            backgroundColor: theme.colors.gray[0],
        },

        '&:disabled': {
            color: theme.colors.gray[4],
            backgroundColor: 'transparent',
            borderColor: theme.colors.gray[2],
        },
    },
    input: {
        '.mantine-Input-wrapper': {
            width: '100%'
        },
        '.mantine-Input-input': {
            height: '40px',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.gray[3]}`,
            fontSize: '14px',
            paddingLeft: '40px',
            transition: 'border-color 0.2s',

            '&:focus': {
                borderColor: theme.colors.blue[5],
                boxShadow: `0 0 0 2px ${theme.colors.blue[1]}`,
            },

            '&::placeholder': {
                color: theme.colors.gray[5],
            },
        },
    },
    calendarIcon: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: '12px',
        color: theme.colors.blue[6],
        pointerEvents: 'none',
    },
}));

const weekdaysES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const monthsES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const DateRangePickerComponent = ({
    value,
    onChange,
    placeholder = "Seleccionar rango de fechas",
    label,
    required = false,
    description,
    error,
    minDate,
    maxDate,
    disabled = false,
    clearable = true,
    ...props
}) => {
    const { classes } = useStyles();

    // Personalización de los controles de navegación
    const renderArrowLeft = (props) => (
        <ActionIcon
            className={classes.navigationControl}
            onClick={props.onClick}
            disabled={props.disabled}
            size="sm"
        >
            <ChevronLeft size={16} />
        </ActionIcon>
    );

    const renderArrowRight = (props) => (
        <ActionIcon
            className={classes.navigationControl}
            onClick={props.onClick}
            disabled={props.disabled}
            size="sm"
        >
            <ChevronRight size={16} />
        </ActionIcon>
    );

    // Función para personalizar la etiqueta del mes y año
    const renderMonthYearLabel = ({ month, year, onPreviousClick, onNextClick, nextMonthDisabled, previousMonthDisabled }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            {renderArrowLeft({ onClick: onPreviousClick, disabled: previousMonthDisabled })}
            <Box sx={{ fontWeight: 500 }}>
                {monthsES[month.getMonth()]} {year}
            </Box>
            {renderArrowRight({ onClick: onNextClick, disabled: nextMonthDisabled })}
        </Box>
    );

    return (
        <div className="date-range-picker-wrapper">
            {label && (
                <label className="block text-gray-700 font-medium mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <CalendarIcon size={18} className={classes.calendarIcon} />
                <DateRangePicker
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    locale="es"
                    classNames={{
                        root: classes.input,
                        calendar: classes.calendar,
                    }}
                    clearable={clearable}
                    firstDayOfWeek="monday"
                    labelFormat="MMMM YYYY"
                    minDate={minDate}
                    maxDate={maxDate}
                    disabled={disabled}
                    weekdayFormat={(date) => weekdaysES[dayjs(date).day() === 0 ? 6 : dayjs(date).day() - 1]}
                    monthLabelFormat={(date) => monthsES[date.getMonth()]}
                    renderDay={(date) => <div>{date.getDate()}</div>}
                    nextIcon={<ChevronRight size={16} />}
                    previousIcon={<ChevronLeft size={16} />}
                    renderMonthName={({ month, year }) => `${monthsES[month]} ${year}`}
                    {...props}
                />
            </div>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default DateRangePickerComponent;