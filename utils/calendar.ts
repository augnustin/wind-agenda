import ical from "ical-generator";

const addHour = (date: Date): Date => {
  const result = date;
  result.setHours(result.getHours() + 1);
  return result;
};

const getDate = (date: Date): String => `${date.getFullYear()}${date.getMonth()}${date.getDay()}12`;

export const getMSInterval = (date1: Date, date2: Date = new Date()) => {
  return date2.getTime() - date1.getTime();
};

export const generateCalendar = (groups) => {
  const cal = ical();

  groups.forEach((group) => {
    const start = group.at(0).time;
    const end = addHour(group.at(-1).time);
    const maxWind = group.reduce((res, { wind }) => (wind > res ? wind : res), 0);
    const minWind = group.reduce((res, { wind }) => (wind < res ? wind : res), group[0].wind);

    cal.createEvent({
      start,
      end,
      summary: "🌬️ Ça souffle !!",
      description: `Entre ${minWind} et ${maxWind} noeuds établis`,
      organizer: { name: "Eole, le dieu du vent" },
      url: `https://www.windy.com/42.604/3.052?icon,${getDate(start)},42.575,3.052,12`,
    });
  });

  return cal;
};
