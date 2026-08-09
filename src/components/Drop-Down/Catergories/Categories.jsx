import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Categories({ categories = ['All', 'Electronics', 'Clothing', 'Accesories'], onSelect }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const [selected, setSelected] = useState('All')
    const open = Boolean(anchorEl)

    const handleSelect = (category) => {
        setSelected(category)
        setAnchorEl(null)
        if (onSelect) onSelect(category)
    }

    return (
        <>
            <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<ExpandMoreIcon />}
            size="small"
            >
            {selected}
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                {categories.map((category) => (
                    <MenuItem key={category} onClick={() => handleSelect(category)}>
                        {category}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default Categories