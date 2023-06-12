const mounts = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
];

export const dateFormater = (utm: number | string) => {
    const date = new Date(+utm);

    return `${date.getDate()} ${mounts[date.getMonth()]} ${date.getFullYear()}`;
};
