import DeleteIcon from '@mui/icons-material/Delete';

const Note = ({id, text, date, handleDeleteNote}) => {
    return (
        <div className="bg-[#fef68a] rounded-lg p-4 min-h-[170px] flex flex-col justify-between whitespace-pre-wrap">
            <span>{text}</span>
            <div className="flex items-center justify-between">
                {/*<small>{date}</small>*/}
                <small>11/04/2023</small>
                <DeleteIcon
                    onClick={() => handleDeleteNote(id)}
                />
            </div>
        </div>
    );
};

export default Note;
