import OutputMerger from "../components/OutputMerger";
import Item1 from "../components/Item1";
import styles from "./Account.module.css";
import logo1 from "../Images/-icon-chevronleft@2x.png";
import logo2 from "../Images/rectangle-18.svg";
import logo3 from "../Images/jigarpanchalzjsptbkol2kunsplash-1-1@2x.png";
import logo4 from "../Images/ellipse-8.svg";
import logo5 from "../Images/-icon.svg";
import logo6 from "../Images/-icon1.svg";
import logo7 from "../Images/intersect1@2x.png";
const Account = () => {
  return (
    <div className={styles.account}>
      <main className={styles.inputFilter}>
        <OutputMerger />
        <section className={styles.frameParent}>
          <div className={styles.frameGroup}>
            <div className={styles.iconChevronLeftWrapper}>
              <img
                className={styles.iconChevronLeft}
                loading="lazy"
                alt=""
                src={logo1}
              />
            </div>
            <div className={styles.frameContainer}>
              <div className={styles.frameDiv}>
                <div className={styles.homeWrapper}>
                  <h2 className={styles.home}>Account</h2>
                </div>
                <div className={styles.frameChild} />
              </div>
              <div className={styles.dataAggregatorWrapper}>
                <form className={styles.dataAggregator}>
                  <img
                    className={styles.dataAggregatorChild}
                    loading="lazy"
                    alt=""
                    src={logo2}
                  />
                  <div className={styles.imageHandler} />
                  <div className={styles.logicOperator}>
                    <div className={styles.inputFilter1}>
                      <img
                        className={styles.jigarPanchalZjsptbkol2kUnspIcon}
                        loading="lazy"
                        alt=""
                        src={logo3}
                      />
                    </div>
                    <div className={styles.inputs}>
                      <img
                        className={styles.inputsChild}
                        loading="lazy"
                        alt=""
                        src={logo4}
                      />
                      <Item1
                        fullName="User name"
                        linhNguyenPlaceholder="Puneet@1"
                      />
                      <div className={styles.itemParent}>
                        <div className={styles.itemGroup}>
                          <div className={styles.item1}>
                            <div className={styles.inputstextFieldselected1}>
                              <div className={styles.line1} />
                              <img
                                className={styles.icon1}
                                alt=""
                                src={logo5}
                              />
                              <div className={styles.linhNguyen1}>
                                hi.peter@gmail.com
                              </div>
                              <div className={styles.title1}>
                                <div className={styles.fullName1}>
                                  Email address
                                </div>
                              </div>
                            </div>
                          </div>
                          <input
                            className={styles.helloabcgmailcom}
                            placeholder="helloabc@gmail.com"
                            type="email"
                          />
                        </div>
                        <div className={styles.item2}>
                          <div className={styles.inputstextFieldselected2}>
                            <div className={styles.line2} />
                            <img className={styles.icon2} alt="" src={logo6} />
                            <div className={styles.titleParent}>
                              <div className={styles.title2}>
                                <div className={styles.fullName2}>Password</div>
                              </div>
                              <input
                                className={styles.linhNguyen2}
                                placeholder="• • • • • •"
                                type="text"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.buttonWrapper}>
                    <button className={styles.button}>
                      <div className={styles.buttonslargenormalrest}>
                        <div className={styles.base} />
                        <div className={styles.editTextHere}>Save</div>
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className={styles.ellipseWrapper}>
            <div className={styles.frameItem} />
          </div>
        </section>
      </main>
      <img className={styles.intersectIcon} alt="" src={logo7} />
      <div className={styles.accountInner}>
        <div className={styles.frameInner} />
      </div>
    </div>
  );
};

export default Account;
