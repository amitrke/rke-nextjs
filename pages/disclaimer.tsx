import Head from "next/head";
import { Container } from "../components/ui/tw";

export default function Disclaimer() {
    return (
        <Container className="py-8 max-w-4xl">
            <Head>
                <title>Disclaimer.</title>
                <meta property="og:title" content="Disclaimer" key="title" />
            </Head>
            <div className="space-y-8">
                <div className="text-center py-8 border-b border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Disclaimer</h1>
                    <p className="text-sm text-slate-600">Last updated: October 02, 2022</p>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Interpretation and Definitions</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-medium text-slate-800 mb-3">Interpretation</h3>
                            <p className="text-slate-700 leading-relaxed">
                                The words of which the initial letter is capitalized have meanings defined under the following conditions.
                                The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-medium text-slate-800 mb-3">Definitions</h3>
                            <p className="text-slate-700 mb-4">For the purposes of this Disclaimer:</p>
                            <ul className="space-y-3 text-slate-700">
                                <li>
                                    <strong className="text-slate-900">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to Roorkee.org.
                                </li>
                                <li>
                                    <strong className="text-slate-900">Service</strong> refers to the Website.
                                </li>
                                <li>
                                    <strong className="text-slate-900">You</strong> means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                                </li>
                                <li>
                                    <strong className="text-slate-900">Website</strong> refers to Roorkee.org, accessible from <a href="http://www.roorkee.org" rel="noreferrer external nofollow noopener" target="_blank" className="text-blue-600 hover:text-blue-700 transition-colors">http://www.roorkee.org</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>The information contained on the Service is for general information purposes only.</p>
                        <p>The Company assumes no responsibility for errors or omissions in the contents of the Service.</p>
                        <p>In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice. This Disclaimer has been created with the help of the <a href="https://www.termsfeed.com/disclaimer-generator/" rel="noreferrer" target="_blank" className="text-blue-600 hover:text-blue-700 transition-colors">TermsFeed Disclaimer Generator</a>.</p>
                        <p>The Company does not warrant that the Service is free of viruses or other harmful components.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">External Links Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company.</p>
                        <p>Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Errors and Omissions Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to insure that the content of the Service is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained on the Service.</p>
                        <p>The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Fair Use Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.</p>
                        <p>The Company believes this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright law.</p>
                        <p>If You wish to use copyrighted material from the Service for your own purposes that go beyond fair use, You must obtain permission from the copyright owner.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Views Expressed Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>The Service may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer or company, including the Company.</p>
                        <p>Comments published by users are their sole responsibility and the users will take full responsibility, liability and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment. The Company is not liable for any comment published by users and reserves the right to delete any comment for any reason whatsoever.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">No Responsibility Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.</p>
                        <p>In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">"Use at Your Own Risk" Disclaimer</h2>
                    <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.</p>
                        <p>The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.</p>
                    </div>
                </section>

                <section className="space-y-6 pb-8">
                    <h2 className="text-2xl font-semibold text-slate-900">Contact Us</h2>
                    <p className="text-slate-700 mb-4">If you have any questions about this Disclaimer, You can contact Us:</p>
                    <ul className="space-y-3 text-slate-700">
                        <li>
                            By visiting this page on our website: <a href="http://www.roorkee.org/contact" rel="external nofollow noopener noreferrer" target="_blank" className="text-blue-600 hover:text-blue-700 transition-colors">http://www.roorkee.org/contact</a>
                        </li>
                    </ul>
                </section>
            </div>
        </Container>
    );
}