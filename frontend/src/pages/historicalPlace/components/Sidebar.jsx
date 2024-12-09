import{ useState,useEffect } from "react";
import {  Select } from "antd";
import { getAllPeriodTags } from '../../../api/HistoricalPlacePeriodService';
import { getAllTypeTags } from '../../../api/HistoricalPlaceTagService';

export default function Sidebar({setFilterHistoricType,setFilterHistoricalTagPeriod}) {
  const [ddActives, setDdActives] = useState("");
  const [tagsOptions, setTagsOption] = useState([]);
  const [periodTagsOptions, setPeriodTagsOption] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  useEffect(() => {
    const getHistoricalPeriods = async () => {
      const PeriodTagsData = await getAllPeriodTags();
      if (PeriodTagsData) {
        setPeriodTagsOption(PeriodTagsData);
      }
     
    };
    getHistoricalPeriods();
  }, []);

  useEffect(() => {
    const getHistoricalTags = async () => {
     
      const typeTagsData = await getAllTypeTags();
      if (typeTagsData) {
        setTagsOption(typeTagsData);
      }
     
    };
    getHistoricalTags();
  }, [])
  return (
    <div className="sidebar -type-1 rounded-12">

      <div className="sidebar__content">
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives ==="tags" ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  ddActives==="tags"?setDdActives(""): setDdActives("tags")
                }
              >
                <h5 className="text-18 fw-500">Historical Tag</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives==="tags" ? { maxHeight: "300px" } : {}
                }
              >
              <Select
                        mode="multiple"
                        placeholder="Please select tags"
                        defaultValue={selectedTags.map((tag) => ({
                            label: tag.name,
                            value: tag._id
                        }))}
                        onChange={(selected) => {
                            console.log("helo", selected);
                            const tags = selected.map((tagValue) => {
                                const tag = tagsOptions.find((p) => p._id === tagValue);
                                return {
                                    name: tag ? tag.name : tagValue,
                                    _id: tag ? tag._id : ''
                                };
                            });
                            console.log(tags);
                            setSelectedTags(tags)
                            setFilterHistoricType(tags);
                        }}
                        style={{
                            width: '100%',
                        }}
                        options={tagsOptions.map((tag) => (
                            {
                                label: tag.name,
                                value: tag._id,
                            }
                        )
                        )}
                    />
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives ==="periods" ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  ddActives==="periods"?setDdActives(""): setDdActives("periods")
                }
              >
                <h5 className="text-18 fw-500">Historical Periods</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives==="periods" ? { maxHeight: "300px" } : {}
                }
              >
                  <Select
                        mode="multiple"
                        placeholder="Please select period tags"
                        defaultValue={selectedPeriods.map((period) => ({
                            label: period.name,
                            value: period._id
                        }))}
                        onChange={(selected) => {
                            console.log("helo", selected);
                            const periods = selected.map((tagValue) => {
                                const period = periodTagsOptions.find((p) => p._id === tagValue);
                                return {
                                    name: period ? period.name : tagValue,
                                    _id: period ? period._id : ''
                                };
                            });
                            console.log(periods);
                            setSelectedPeriods(periods);
                            setFilterHistoricalTagPeriod(periods);
                            
                        }}
                        style={{
                            width: '100%',
                        }}
                        options={periodTagsOptions.map((period) => (
                            {
                                label: period.name,
                                value: period._id
                            }
                        )
                        )}
                    />
              </div>
            </div>
          </div>
        </div>

        

        

        

       

       
        
       
      </div>
    </div>
  );
}
