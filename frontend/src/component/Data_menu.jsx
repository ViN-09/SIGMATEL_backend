const submenuItems = [
    { label: "Checklist", icon: "bi-speedometer2" },
    { label: "Summary-Ceklist", icon: "bi-file-earmark-check" },
    { label: "Data-Dashboard", icon: "bi-speedometer" },
    { label: "Data-Potensi", icon: "bi-database" },
    { label: "Data-Issue", icon: "bi-exclamation-circle" },
    { label: "Bank-Acces", icon: "bi-key" },
    { label: "Buku-Tamu", icon: "bi-book" }
];

export default function Data_menu({ activeSubmenu, setActiveSubmenu }) {
    return (
        <div className="simain-dashboard-sub-menu">
            <div className="submenu-card">
                <ul className="submenu-list">
                    {submenuItems.map((item) => (
                        <li
                            key={item.label}
                            id={item.label}
                            className={activeSubmenu === item.label ? "active" : ""}
                            onClick={() => setActiveSubmenu(item.label)}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
