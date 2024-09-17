// eslint-disable-next-line react/prop-types
const Label = ({ labelText }) => {
    return (
        <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{labelText}</label>
    );
}

export default Label;