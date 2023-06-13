import React, { useEffect, useState } from 'react';

const RenderColumn = ({ dates, index }) => {
    const [tableColumns, setTableColumns] = useState([]);

    useEffect(() => {
        const startMonth = parseInt(dates[0].split('/')[1]);
        const column = `T${((startMonth - 1 + index) % 12) + 1}`;
        setTableColumns([column]);
    }, [dates, index]);

    return (
        <div>
            {tableColumns.map((column) => (
                <div key={column}>{column}</div>
            ))}
        </div>
    );
};

export default RenderColumn;
