import React from 'react';

const RenderColumn = ({ dateString }) => {
    // Validate the input
    if (!Array.isArray(dateString) || dateString.length === 0) {
        return <div>Invalid input format</div>;
    }

    // Generate table column titles based on the month values
    const table_columns = dateString.map((date, index) => {
        const month = date.split('/')[1];
        const formatted_month = month.padStart(2, '0');
        const table_column = `T${index + 1}:${formatted_month}`;
        return table_column;
    });

    return (
        <div>
            {table_columns.map((column) => (
                <div key={column}>{column}</div>
            ))}
        </div>
    );
};

export default RenderColumn;
