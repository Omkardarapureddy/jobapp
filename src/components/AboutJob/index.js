import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJob extends Component {
  state = {
    jobData: {},
    similarJobData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        LifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        Location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachItem.title,
      }))

      const updatedSimilarJobDetails = fetchedData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          jobDescription: eachItem.job_description,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          Location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )

      this.setState({
        jobData: updatedData,
        similarJobData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-details-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getProductData()
  }

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobData, similarJobData} = this.state

    if (jobData.length > 0) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        LifeAtCompany,
        Location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobData[0]

      return (
        <div>
          <div>
            <div className="list-part-1">
              <img src={companyLogoUrl} alt={title} className="img" />
              <div>
                <h1 className="heading-list">{title}</h1>
                <div className="star-rating">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                  <AiFillStar />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="role-container">
              <div>
                <div className="location">
                  <MdLocationOn />
                  <p>{Location}</p>
                </div>
                <div className="location">
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>

            <hr />
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>
              Visit <BiLinkExternal />
            </a>
            <p>{jobDescription}</p>
          </div>

          <div>
            <h1>Skills</h1>
            <ul className="ul-job-details-container">
              {skills.map(eachSkill => (
                <li className="li-job-details-container" key={eachSkill.name}>
                  <img
                    className="skill-img"
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="company-life-img-container">
            <div className="life-heading-para-container">
              <h1>Life at Company</h1>
              <p>{LifeAtCompany.description}</p>
            </div>
            <img src={LifeAtCompany.imageUrl} alt="life at company" />
          </div>
          <h1 className="similar-products-heading">Similar Jobs</h1>
          <ul className="similar-products-list">
            {similarJobData.map(eachSimilarjob => (
              <SimilarJobs
                similarJobData={eachSimilarjob}
                key={eachSimilarjob.id}
              />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default AboutJob
