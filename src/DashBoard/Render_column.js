import React, {useEffect, useState} from 'react';

const RenderColumn = ({dates, onColumnsChange}) => {
    const [table_columns, setTableColumns] = useState([]);

    useEffect(() => {
        const startMonth = parseInt(dates[0].split('/')[1]);
        const endMonth = parseInt(dates[dates.length - 1].split('/')[1]);

        const columns = [];

        for (let i = startMonth; i <= endMonth; i++) {
            const month = i.toString().padStart(2, '0');
            const table_column = `T${i}:${month}`;
            columns.push(table_column);
        }

        setTableColumns(columns);

        if (typeof onColumnsChange === 'function') {
            onColumnsChange(columns);
        }
    }, [dates, onColumnsChange]);

    return (
        <div>
            {table_columns.map((column) => (
                <div key={column}>
                    {column}
                </div>
            ))}
        </div>
    );
};

export default RenderColumn;
