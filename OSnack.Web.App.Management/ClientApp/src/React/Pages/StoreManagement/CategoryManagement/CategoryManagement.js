﻿import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button, DropdownBtn } from '../../../Components/Buttons-OSnack';
import { oCategory } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { getCategories } from '../../../../Redux/Actions/CategoryManagementAction';
import { AlertTypes, GetAllRecords, ProductUnitType } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { Pagination } from '../../../Components/Misc-OSnack';
import AddModifyCategoryModal from './AddModifyCategoryModal';

class CategoryManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         categoryList: [],
         searchValue: '',
         isOpenCategoryModal: false,
         selectedCategory: new oCategory(),
         listTotalCount: 0,
         SelectedPage: 1,
         MaxNumberPerItemsPage: 5,
         filterProductUnitValue: GetAllRecords,
         filterStatus: GetAllRecords,
      };

      this.editCategory = this.editCategory.bind(this);
      this.search = this.search.bind(this);
   }
   async search(SelectedPage, MaxNumberPerItemsPage) {

      if (!(SelectedPage == null))
         this.state.SelectedPage = SelectedPage;

      if (!(MaxNumberPerItemsPage == null))
         this.state.MaxNumberPerItemsPage = MaxNumberPerItemsPage;

      let searchVal = GetAllRecords;
      if (this.state.searchValue != null && this.state.searchValue != '')
         searchVal = this.state.searchValue;

      await this.props.getCategories(
         this.state.SelectedPage,
         this.state.MaxNumberPerItemsPage,
         searchVal,
         this.state.filterProductUnitValue,
         this.state.filterStatus,
         ((result) => {
            if (result.errors.length > 0) {
               this.setState({ alertList: result.errors });
               return;
            }
            this.setState({ categoryList: result.categoryList, listTotalCount: result.totalCount });
         }).bind(this));
   }

   async editCategory(category) {
      this.setState({ selectedCategory: category, isOpenCategoryModal: true });
   }

   render() {
      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <Row className="col-12 col-md-10 col-lg-8 p-3 mb-3 bg-white ml-auto mr-auto">
                  <PageHeader title="Category Management" />
                  {/***** Controls  ****/}
                  <Row className="col-12 m-0 p-0">
                     <Alert alertItemList={this.state.alertList}
                        type={this.state.alertType}
                        className="col-12 mb-2"
                        onClosed={() => this.setState({ alertList: [] })}
                     />
                     {/***** Search Input  ****/}
                     <Input placeholder="Search"
                        onChange={i => this.setState({ searchValue: i.target.value })}
                        bindedValue={this.state.searchValue}
                        className="col-7 col-md-6 m-0 p-0"
                        inputClassName="form-control-lg"
                        inputCss="mt-1 m-0"
                        key="searchInput"
                        lblDisabled
                     />
                     <Button title={this.state.searchValue === '' ? 'Show All' : 'Search'}
                        className="col-5 col-md-2 btn-green btn-lg"
                        onClick={async () => await this.search(this.state.SelectedPage, this.state.MaxNumberPerItemsPage)}
                     />

                     <Button title="New Category"
                        className="col-12 col-md-4 mt-2 mt-md-0 btn-green btn-lg"
                        onClick={() => this.editCategory(new oCategory())}
                     />
                  </Row>

                  {/***** Filter Drop-downs ****/}
                  <Row className="col-12 m-0 p-0 mt-2 mb-2">
                     <label className="col-auto align-self-center" children="Filter by: " />
                     <DropdownBtn
                        title={this.state.filterProductUnitValue === GetAllRecords
                           ? <React.Fragment>Unit Type: (All) </React.Fragment>
                           : <React.Fragment>Unit Type: ({this.state.filterProductUnitValue})</React.Fragment>
                        }
                        className="col-12 col-md mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {ProductUnitType.map(i =>
                                 <a key={i.name}
                                    className="dropdown-item text-nav"
                                    onClick={() => this.setState({ filterProductUnitValue: i.name })}
                                    children={i.name}
                                 />
                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={() => this.setState({ filterProductUnitValue: GetAllRecords })}
                                 children='All' />
                           </div>
                        }
                     />
                     <DropdownBtn
                        title={this.state.filterStatus === GetAllRecords
                           ? <React.Fragment>Status: (All) </React.Fragment>
                           : <React.Fragment>Status: ({this.state.filterStatus ? "Active" : "Disabled"})</React.Fragment>
                        }
                        className="col-12 col-md mt-2 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ filterStatus: true })}
                                 children="Active"
                              />
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ filterStatus: false })}
                                 children="Disabled"
                              />

                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ filterStatus: GetAllRecords })}
                                 children='All' />
                           </div>
                        }
                     />


                  </Row>

                  {/***** Category Table  ****/}
                  <Row className="col-12 p-0 m-0">
                     <Table className="col-12 text-center" striped responsive>
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Unit</th>
                              <th>Unit Quantity</th>
                              <th>Status</th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.categoryList.length > 0 &&
                           <tbody>
                              {this.state.categoryList.map((i) => {
                                 return (
                                    <tr key={i.id}>
                                       <td>{i.name}</td>
                                       <td>£{i.price}</td>
                                       <td>{ProductUnitType[i.unit].name}</td>
                                       <td>{i.unitQuantity}</td>
                                       <td>{i.status ? "Active" : "Disabled"}</td>
                                       <td>
                                          <div className="p-0 m-0">
                                             <button className="btn btn-sm btn-blue col-12 m-0"
                                                onClick={() => this.editCategory(i)}>
                                                Edit</button>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })
                              }
                           </tbody>
                        }
                     </Table>
                     <Pagination setListOnLoad={false}
                        setList={this.search}
                        listCount={this.state.listTotalCount} />
                  </Row>
                  {this.state.isOpenCategoryModal &&
                     <AddModifyCategoryModal isOpen={this.state.isOpenCategoryModal}
                        category={this.state.selectedCategory}
                        onActionCompleted={this.search}
                        onCancel={() => this.setState({ isOpenCategoryModal: false, selectedCategory: new oCategory() })}
                     />
                  }
               </Row>
            </Row>
         </Container >
      );
   }
}
/// Mapping the redux state with component's properties
const mapStateToProps = (state) => {
   return {
   };
};
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
   getCategories,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(CategoryManagement);