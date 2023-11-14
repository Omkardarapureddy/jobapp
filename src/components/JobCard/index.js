import {Link} from 'react-router-dom'
import {GrLocation} from 'react-icons/gr'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`}>
      <li className="list-container">
        <div className="list-part-1">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="img"
          />
          <div>
            <h1 className="heading-list">{title}</h1>
            <div className="start-rating">
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="role-container">
          <div>
            <div className="location">
              <GrLocation />
              <p>{location}</p>
            </div>
            <div className="location">
              <GrLocation />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>

        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
