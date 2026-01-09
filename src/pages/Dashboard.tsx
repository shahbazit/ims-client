interface StatCard {
  title: string;
  value: string;
  icon: string;
  bg: string;
  color: string;
  change: string;
  isUp: boolean;
}

const stats: StatCard[] = [
  {
    title: "Total Users",
    value: "12,345",
    icon: "fa-users",
    bg: "bg-soft-primary",
    color: "text-primary",
    change: "5.25%",
    isUp: true
  },
  {
    title: "Revenue",
    value: "$45,678",
    icon: "fa-dollar-sign",
    bg: "bg-soft-success",
    color: "text-success",
    change: "2.15%",
    isUp: true
  },
  {
    title: "Tasks",
    value: "64",
    icon: "fa-list-check",
    bg: "bg-soft-warning",
    color: "text-warning",
    change: "1.05%",
    isUp: false
  },
  {
    title: "Pending",
    value: "12",
    icon: "fa-clock",
    bg: "bg-soft-danger",
    color: "text-danger",
    change: "3.55%",
    isUp: true
  }
];

export default function StatsCards() {
  return (
    <div className="p-4">
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 border-0 stats-card">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="card-subtitle text-muted text-uppercase fw-semibold fs-7">
                    {stat.title}
                  </h6>

                  <div className={`icon-shape ${stat.bg} ${stat.color} rounded-circle`}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                </div>

                <h3 className="card-title fw-bold mb-0">{stat.value}</h3>

                <span className={`${stat.isUp ? "text-success" : "text-danger"} small fw-medium`}>
                  <i className={`fa-solid ${stat.isUp ? "fa-arrow-up" : "fa-arrow-down"}`}></i>
                  {" "}{stat.change}
                </span>
                <span className="text-muted small"> Since last month</span>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
