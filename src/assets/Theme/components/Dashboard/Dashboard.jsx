import { useState } from 'react';
import Navbar from '../../assets/Navbar/Navbar'
import Categories from '../Drop-Down/Catergories/Categories'
import Profile from '../Drop-Down/Profile/Profile'
import Product from '../Product-page/Product'

function Dashboard() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')

    return (
        <div>
            <Navbar onSearch={setSearch} />
            <div className="flex items-center gap-3 px-4 py-2">
                <Categories onSelect={setCategory} />
                <Profile />
            </div>
            <Product searchQuery={search} category={category} />
        </div>
    )
}

export default Dashboard