import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import { Button, Divider, Grid, Header, Input, Image, Loader, Card, Label, Modal, Form 
} from 'semantic-ui-react'

import { buyCar, createCar, getCars, getUploadUrl, uploadFile } from '../api/cars-api'
import Auth from '../auth/Auth'
import { BuyCarError } from '../error/BuyCarError'
import { Car } from '../types/Car'
import { CarSaleRequest } from '../types/CarSaleRequest'

enum UploadState {
  NoUpload,
  UploadStarting,
  FetchingPresignedUrl,
  UploadingFile,
}

interface CarsProps {
  auth: Auth
  history: History
}

interface CarsState {
  cars: Car[]
  newTodoName: string
  loadingTodos: boolean
  open: boolean
  file: any
  brand: string
  gearType: string
  model: string
  year: string
  amount: string
  uploadState: UploadState
}

export class Todos extends React.PureComponent<CarsProps, CarsState> {
  state: CarsState = {
    cars: [],
    newTodoName: '',
    loadingTodos: true,
    open: false,
    file: undefined,
    brand: "",
    gearType: "",
    model: "",
    year: "",
    amount: "",
    uploadState: UploadState.NoUpload
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }
  handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ brand: event.target.value })
  }
  handleGearTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gearType: event.target.value })
  }
  handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ model: event.target.value })
  }
  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ year: event.target.value })
  }
  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ amount: event.target.value })
  }
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }


  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    this.setUploadState(UploadState.UploadStarting)
    try {
      const token = this.props.auth.getIdToken()
      const carRequest: CarSaleRequest = {
        brand: this.state.brand,
        model: this.state.model,
        gearType: this.state.gearType,
        year: this.state.year,
        amount: parseInt(this.state.amount)
      }
      const createdCar: Car = await createCar(token, carRequest)
      
      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(token, createdCar.carId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('Car uploaded for sale')

      await this.getCarsForDisplay()
      this.setState({ open: false })
    } catch (error) {
      alert('Could not upload car: ' + error.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }

  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }


  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  getCarsForDisplay = async () => {
    try {
      const cars = await getCars(this.props.auth.getIdToken())
      this.setState({
        cars: cars,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }


  onBuyCar = async (cardId: string) => {
    try {
      await buyCar(this.props.auth.getIdToken(), cardId)

      await this.getCarsForDisplay()
    } catch (e) {
      if (e instanceof BuyCarError) {
        console.log(e)
        alert("You cannot buy your own car")
      }
      
    }
  }

  //TODO: consider to totally remove
  onTodoCheck = async (pos: number) => {
    // try {
    //   const todo = this.state.cars[pos]
    //   await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
    //     name: todo.name,
    //     dueDate: todo.dueDate,
    //     done: !todo.done
    //   })
    //   this.setState({
    //     cars: update(this.state.cars, {
    //       [pos]: { done: { $set: !todo.done } }
    //     })
    //   })
    // } catch {
    //   alert('Todo deletion failed')
    // }
  }

  async componentDidMount() {
    await this.getCarsForDisplay()
  }

  render() {
    return (
      <div>
        <Grid container>
          <Grid.Row>
            <Grid.Column>
              
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Header as="h1">Cars</Header>
        {this.renderCreateCarButton()}
      
        {this.renderTodos()}
      </div>
    )
  }

  renderCreateCarButton() {
    return (
      <Modal onClose={() => this.setState({ open: false })} onOpen={() => this.setState({ open: true })} open={this.state.open}
      trigger={<Button positive style={formStyle}>SELL YOUR CAR</Button>}>

      <Modal.Header>SELL MY CAR</Modal.Header>
      <Modal.Content image>

        <Modal.Description>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Brand</label>
              <input placeholder='Brand' onChange={this.handleBrandChange}/>
            </Form.Field>
            <Form.Field>
              <label>Model</label>
              <input placeholder='Model' onChange={this.handleModelChange}/>
            </Form.Field>
            <Form.Field>
              <label>GearType</label>
              <input placeholder='GearType' onChange={this.handleGearTypeChange}/>
            </Form.Field>
            <Form.Field>
              <label>Year</label>
              <input placeholder='Year' onChange={this.handleYearChange}/>
            </Form.Field>
            <Form.Field>
              <label>Amount</label>
              <input placeholder='amount' onChange={this.handleAmountChange} />
            </Form.Field>
            <Form.Field>
              <label>Image</label>
              <input type='file' placeholder='image' onChange={this.handleFileChange} />
            </Form.Field>

            <br />

            <Button 
            type='submit' 
            positive
            loading={this.state.uploadState !== UploadState.NoUpload}
            >
              Submit</Button>
          </Form>
        </Modal.Description>
      </Modal.Content>
      {/* <Modal.Actions>
        <Button color='black' onClick={() => this.setState({open: false})}>
    Nope
  </Button>
        <Button
          content="Submit"
          labelPosition='right'
          icon='checkmark'
          type='submit'
          positive
        />
      </Modal.Actions> */}
    </Modal>
    )

  }


  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid columns={3} divided>
        {this.state.cars.map((car, pos) => {
          return (
            <Grid.Column key={car.carId}>
              <Card>
                <Image className="car-image" src={car.attachmentUrl} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{`${car.year} ${car.brand} ${car.model}`}</Card.Header>
                  <Card.Meta>
                    <span className='date'>N{car.amount}</span>
                  </Card.Meta>
                  <Card.Description>
                    {car.isBought == true
                    ?  <Label color='red'>Sold</Label>
                    : <Label color='green'>Available</Label>
                    }
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  {car.isBought == false && <Button content='Buy' primary onClick={() => this.onBuyCar(car.carId)} /> }
                </Card.Content>
              </Card>
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}

const formStyle = {
  marginBottom: 30
}