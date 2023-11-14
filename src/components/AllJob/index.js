import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import ProfileDetails from '../ProfileDetails'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class AllJob extends Component {
  state = {
    jobList: [],
    apiStatus: apiStatusConstants.initial,
    checkboxInputs: [], // Added checkboxInputs state
    radioInput: '', // Added radioInput state
    searchInput: '', // Added searchInput state
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs.join(
      ',',
    )}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        price: job.price,
        id: job.id,
        title: job.title,
        rating: job.rating,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
      }))
      this.setState({
        jobList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getProducts()
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderJobListView = () => {
    const {jobList} = this.state
    const noJob = jobList.length === 0

    return noJob ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <div className="all-products-container">
        <ul className="products-list">
          {jobList.map(job => (
            <JobCard jobDetails={job} key={job.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllJob = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getProducts)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    if (!checkboxInputs.includes(event.target.id)) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getProducts,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkboxInputs: filteredData}, this.getProducts)
    }
  }

  onGetCheckBoxesView = () => {
    const {checkboxInputs} = this.state
    return (
      <ul className="check-boxes-container">
        {employmentTypesList.map(eachItem => (
          <li className="li-container" key={eachItem.employmentTypeId}>
            <input
              className="input"
              id={eachItem.employmentTypeId}
              type="checkbox"
              onChange={this.onGetInputOption}
              checked={checkboxInputs.includes(eachItem.employmentTypeId)}
            />
            <label className="label" htmlFor={eachItem.employmentTypeId}>
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  onGetRadioButtonsView = () => {
    const {radioInput} = this.state
    return (
      <ul className="radio-button-container">
        {salaryRangesList.map(eachItem => (
          <li className="li-container" key={eachItem.salaryRangeId}>
            <input
              className="radio"
              id={eachItem.salaryRangeId}
              type="radio"
              name="option"
              onChange={this.onGetRadioOption}
              checked={radioInput === eachItem.salaryRangeId}
            />
            <label className="label" htmlFor={eachItem.salaryRangeId}>
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getProducts()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="all-products-section">
        <Header />
        <div>
          <ProfileDetails />
          <div className="jobs-container">
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioButtonsView()}
            <div>
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                Search
              </button>
            </div>
            {this.renderAllJob()}
          </div>
        </div>
      </div>
    )
  }
}

export default AllJob
